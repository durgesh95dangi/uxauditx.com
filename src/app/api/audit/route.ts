// src/app/api/audit/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { scrapePage } from '@/lib/scraper'
import { runFullAudit } from '@/lib/claude'
import { supabase } from '@/lib/supabase'
import { ratelimit } from '@/lib/ratelimit'
import { extractDomain, getClientIP } from '@/lib/utils'
import { getProviderInfo } from '@/lib/ai-provider'

export const maxDuration = 300

const schema = z.object({
  url:   z.string().url('Please enter a valid URL starting with https://'),
  name:  z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
})

export async function POST(req: NextRequest) {
  const ip = getClientIP(req)

  // Rate limit check (bypass if dummy keys are in .env.local)
  let success = true;
  if (!process.env.UPSTASH_REDIS_REST_URL?.includes('xxxx')) {
    try {
      const limitResult = await ratelimit.limit(ip);
      success = limitResult.success;
    } catch (e) {
      console.warn('Rate limit failed, bypassing for development', e);
    }
  }

  if (!success) {
    return NextResponse.json(
      { error: 'Too many audits. Please wait 1 hour before scanning again.' },
      { status: 429 }
    )
  }

  try {
    const body = await req.json()
    const { url, name, email } = schema.parse(body)

    const { provider, model } = getProviderInfo()

    // 1. Save lead immediately — before anything else
    // This captures every user even if the audit fails later
    const { data: audit, error: insertError } = await supabase
      .from('audits')
      .insert({
        url,
        name,
        email,
        url_domain: extractDomain(url),
        ip_address: ip,
        user_agent: req.headers.get('user-agent') || '',
        referrer: req.headers.get('referer') || '',
        utm_source: new URL(req.url).searchParams.get('utm_source') || '',
        utm_medium: new URL(req.url).searchParams.get('utm_medium') || '',
        utm_campaign: new URL(req.url).searchParams.get('utm_campaign') || '',
        ai_provider: provider,
        ai_model: model,
        status: 'scraping',
        scrape_started_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (insertError) throw insertError

    // 2. Scrape the page
    let page
    try {
      page = await scrapePage(url)
    } catch (scrapeErr: any) {
      await supabase.from('audits').update({
        status: 'failed',
        scrape_error: scrapeErr.message || 'Failed to load website',
      }).eq('id', audit.id)
      return NextResponse.json(
        { error: 'Could not load that website. Please check the URL and try again.' },
        { status: 422 }
      )
    }

    // Update DB with scrape metadata + move to analyzing
    await supabase.from('audits').update({
      status: 'analyzing',
      scraped_title: page.title,
      scraped_h1: page.h1,
      scraped_word_count: page.wordCount,
      scraped_has_https: page.hasHTTPS,
      scrape_done_at: new Date().toISOString(),
      analysis_started_at: new Date().toISOString(),
    }).eq('id', audit.id)

    // 3. Run all 12 AI parameters
    const result = await runFullAudit(page, audit.id)

    // 4. Save full results to DB
    // ALL results saved — free and paid. Frontend only sees free ones.
    await supabase.from('audits').update({
      status: 'complete',
      overall_score: result.overallScore,
      summary: result.summary,
      results: result.allIssues,              // save all 12 here
      free_results: result.freeIssues,
      analysis_done_at: new Date().toISOString(),
    }).eq('id', audit.id)

    // 5. Return ONLY free issues to frontend
    return NextResponse.json({
      auditId: audit.id,
      overallScore: result.overallScore,
      summary: result.summary,
      freeIssues: result.freeIssues,         // only 3
      totalIssues: result.totalIssues,        // 12 total
    })

  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.issues[0]?.message || 'Invalid input' },
        { status: 400 }
      )
    }
    console.error('Audit error:', err)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
