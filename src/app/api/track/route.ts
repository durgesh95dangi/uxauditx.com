// src/app/api/track/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getClientIP } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const { page } = await req.json()
    const ip = getClientIP(req)
    const referer = req.headers.get('referer') || ''

    let utm_source = '', utm_medium = ''
    try {
      const ref = new URL(referer)
      utm_source = ref.searchParams.get('utm_source') || ''
      utm_medium  = ref.searchParams.get('utm_medium')  || ''
    } catch {}

    await supabase.from('page_views').insert({
      page,
      ip_address: ip,
      user_agent: req.headers.get('user-agent') || '',
      referrer: referer,
      utm_source,
      utm_medium,
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false })
  }
}
