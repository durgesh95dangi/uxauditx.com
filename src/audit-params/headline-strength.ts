// src/audit-params/headline-strength.ts
import type { AuditParam } from '@/types'

export const headlineStrength: AuditParam = {
  id: 'headline_strength',
  name: 'Headline Strength',
  category: 'copy',
  weight: 9,
  isFreePreview: true,

  description: 'The H1 headline is the first thing visitors read. It must communicate value clearly in under 8 seconds or they leave.',

  prompt: `Analyze the MAIN HEADLINE (H1) of this webpage.

You have been given:
1. A desktop screenshot showing the hero section
2. A mobile screenshot of the same
3. Extracted page data with the H1 text

What to look for:
- What is the exact H1 text? Quote it fully.
- Is it benefit-focused ("Double your revenue in 30 days") or feature-focused ("Advanced Analytics Platform")?
- Does it answer "what's in it for me?" immediately?
- Is it specific or vague? "Grow your business" = vague. "Get 50% more leads from your existing traffic" = specific.
- Is the target audience immediately clear?
- Is it the very first thing visible above the fold?
- Does it match what the product/service actually does?
- Would a visitor with zero context understand the value in 5 seconds?

Quote the actual H1. If it is just the company name or a generic phrase, that is a critical failure. Be direct.`,

  scoringRubric: {
    0:  'No H1 found, or H1 is just the company name/logo text with zero value communication',
    4:  'Headline exists but is vague, generic, or feature-focused with no clear benefit',
    7:  'Reasonable headline but could be more specific, more benefit-driven, or more targeted',
    10: 'Exceptional: specific, benefit-first, audience-aware headline that communicates value in seconds'
  }
}
