// src/audit-params/pricing-clarity.ts
import type { AuditParam } from '@/types'

export const pricingClarity: AuditParam = {
  id: 'pricing_clarity',
  name: 'Pricing Clarity',
  category: 'conversion',
  weight: 7,
  isFreePreview: false,

  description: 'Hidden or confusing pricing is a top reason visitors leave without converting. Clear pricing sets expectations and pre-qualifies buyers.',

  prompt: `Analyze the PRICING CLARITY on this webpage.

Using the screenshots and text data, look for:
- Is pricing visible on this page or completely hidden?
- If there is a pricing section, is it clear and easy to compare?
- Are prices stated in a specific currency or is currency unclear?
- Is there a free plan, free trial, or freemium option mentioned?
- Are the pricing tiers clearly differentiated with what's included?
- Is the price anchored well (e.g. show expensive plan first to make others look affordable)?
- Are there hidden fees, "starting from", or vague pricing signals that create uncertainty?
- For non-SaaS: is there a price or does it say "Contact us for pricing" (conversion killer)?

If this page has NO pricing information at all, that is a significant issue. Visitors cannot convert if they don't know what it costs.

Note: Some pages intentionally omit pricing (enterprise). If that seems intentional, lower the severity but still flag it.`,

  scoringRubric: {
    0:  'Completely hidden pricing. "Contact us" or no mention of cost whatsoever.',
    4:  'Vague pricing: "starting from", unclear tiers, or confusing what is included',
    7:  'Pricing is present but not perfectly clear — missing comparison features or currency confusion',
    10: 'Crystal clear pricing: specific numbers, clear tiers, what is included, anchored well'
  }
}
