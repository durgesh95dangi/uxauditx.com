// src/audit-params/value-proposition.ts
import type { AuditParam } from '@/types'

export const valueProposition: AuditParam = {
  id: 'value_proposition',
  name: 'Value Proposition',
  category: 'copy',
  weight: 8,
  isFreePreview: false,

  description: 'The unique value proposition tells visitors why they should choose this over every other option. If it is not clear and unique, they leave.',

  prompt: `Analyze the VALUE PROPOSITION of this webpage.

Using the screenshots and extracted text, determine:
- What does this product/service actually do? Can you tell clearly?
- What specific problem does it solve?
- Who is it for (target audience)?
- Why is it better than alternatives? Is a differentiator communicated?
- Is the value prop visible above the fold or buried?
- Does the copy focus on features (what it is) or outcomes (what the user gains)?

The value proposition is typically in the hero section — headline + subheadline + maybe a few bullet points.

Look for these common failures:
- "We help businesses grow" (not specific enough)
- Features listed with no outcomes: "50 integrations, 99.9% uptime, SOC 2 compliant"
- No differentiation — could be any competitor's homepage
- Jargon or buzzwords that obscure meaning

Quote actual copy from the page in your analysis.`,

  scoringRubric: {
    0:  'Cannot determine what the product does from the homepage. Completely unclear.',
    4:  'Vague value prop that could apply to any company in the space. No differentiation.',
    7:  'Clear what the product does but differentiation is weak or outcomes are not specific',
    10: 'Crystal clear: specific problem, specific audience, specific outcome, clear differentiator'
  }
}
