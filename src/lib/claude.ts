// src/lib/claude.ts  (name kept as "claude" but works with any provider)
import { analyzeWithAI, getProviderInfo } from './ai-provider'
import { buildPageContext } from './scraper'
import { AUDIT_PARAMS, calcOverallScore, getSeverity } from '@/audit-params/_registry'
import type { ScrapedPage, ParamResult, AuditResult, AuditParam } from '@/types'

// System prompt is the same for every provider
const SYSTEM_PROMPT = `You are a senior Conversion Rate Optimization (CRO) consultant with 15 years of experience.
You analyze websites and provide brutally honest, specific, actionable feedback.

RULES:
1. Never give generic advice. Always reference the ACTUAL content found on this specific page.
2. Quote actual text from the page when criticizing it.
3. Be specific about the fix — not "improve your CTA" but "change the CTA from 'Submit' to 'Start My Free Trial'"
4. You are given page screenshots AND extracted text data. Use both.
5. Return ONLY a valid JSON object. No markdown. No explanation. No backticks.
6. The JSON must match the exact schema specified in the user message.`

// Run ONE parameter through the configured AI provider
async function runParam(
  param: AuditParam,
  page: ScrapedPage,
  pageContext: string
): Promise<ParamResult> {
  const userText = `
PAGE DATA:
${pageContext}

YOUR TASK:
Analyze this specific aspect: ${param.name.toUpperCase()}

${param.prompt}

SCORING RUBRIC for ${param.name}:
- Score 0-1: ${param.scoringRubric[0]}
- Score 3-5: ${param.scoringRubric[4]}
- Score 6-7: ${param.scoringRubric[7]}
- Score 8-10: ${param.scoringRubric[10]}

Return ONLY this JSON object (no backticks, no markdown, no explanation):
{
  "score": <integer 0 to 10>,
  "title": "<max 8 words — the specific issue on THIS page>",
  "problem": "<2-3 sentences — what is wrong on THIS page, quote actual text you found>",
  "fix": "<2-3 sentences — specific, actionable fix for this exact page>",
  "example": "<show a concrete rewritten example — e.g. rewrite their actual CTA or headline>",
  "impact": "<1 sentence — how this specific issue hurts their conversion rate>"
}`

  const raw = await analyzeWithAI({
    systemPrompt: SYSTEM_PROMPT,
    userText,
    imageBase64: page.desktopScreenshot,
    imageBase64Mobile: page.mobileScreenshot,
    maxTokens: 600,
  })

  // Clean the response — some models wrap in backticks
  const cleaned = raw
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim()

  let parsed: any = {}
  try {
    parsed = JSON.parse(cleaned)
  } catch {
    // If JSON parse fails, return a fallback with score 5
    parsed = {
      score: 5,
      title: `${param.name} needs review`,
      problem: 'Analysis could not be completed for this parameter.',
      fix: `Manually review the ${param.name} on your page.`,
      example: 'N/A',
      impact: 'Unable to determine impact.',
    }
  }

  const score = Math.min(10, Math.max(0, Number(parsed.score) || 5))

  return {
    id: param.id,
    name: param.name,
    category: param.category,
    isFreePreview: param.isFreePreview,
    score,
    severity: getSeverity(score),
    title: String(parsed.title || ''),
    problem: String(parsed.problem || ''),
    fix: String(parsed.fix || ''),
    example: String(parsed.example || ''),
    impact: String(parsed.impact || ''),
  }
}

// Run ALL 12 parameters — in batches to avoid rate limits
export async function runFullAudit(
  page: ScrapedPage,
  auditId: string
): Promise<AuditResult> {
  const pageContext = buildPageContext(page)
  const results: ParamResult[] = []
  const BATCH_SIZE = 3  // 3 params at a time — safe for all providers

  for (let i = 0; i < AUDIT_PARAMS.length; i += BATCH_SIZE) {
    const batch = AUDIT_PARAMS.slice(i, i + BATCH_SIZE)
    const batchResults = await Promise.all(
      batch.map(param => runParam(param, page, pageContext))
    )
    results.push(...batchResults)
    // Small delay between batches to respect rate limits
    if (i + BATCH_SIZE < AUDIT_PARAMS.length) {
      await new Promise(r => setTimeout(r, 500))
    }
  }

  // Final summary call
  const summaryText = await analyzeWithAI({
    systemPrompt: 'You are a CRO expert. Return ONLY valid JSON. No markdown.',
    userText: `Based on these CRO audit scores for ${page.url}, write a 2-sentence executive summary.
Be direct. Mention the biggest issue and the overall prognosis.
Scores: ${results.map(r => `${r.name}: ${r.score}/10`).join(', ')}

Return JSON: { "summary": "<2 sentences here>" }`,
    maxTokens: 150,
  })

  let summary = ''
  try {
    const cleaned = summaryText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    summary = JSON.parse(cleaned).summary || ''
  } catch {
    summary = `Audit complete for ${page.url}. Review the issues below to improve conversion.`
  }

  const overallScore = calcOverallScore(results)
  const freeIssues = results.filter(r => r.isFreePreview)

  return {
    auditId,
    overallScore,
    summary,
    freeIssues,
    allIssues: results,
    totalIssues: results.length,
  }
}
