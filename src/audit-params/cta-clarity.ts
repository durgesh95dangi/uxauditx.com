// src/audit-params/cta-clarity.ts
import type { AuditParam } from '@/types'

export const ctaClarity: AuditParam = {
  id: 'cta_clarity',
  name: 'CTA Clarity',
  category: 'conversion',
  weight: 10,
  isFreePreview: true,

  description: 'Checks if the primary call-to-action is visible, specific, and compelling. This single element has the biggest impact on conversion.',

  prompt: `Analyze the CALL-TO-ACTION (CTA) elements on this webpage.

You have been given:
1. A desktop screenshot showing what visitors see first on a wide screen
2. A mobile screenshot showing what mobile users see (55%+ of web traffic)
3. Extracted page data with the exact button/link text found on the page

What to look for:
- What is the PRIMARY CTA button text? Quote it exactly.
- Is it visible above the fold without scrolling on both desktop and mobile?
- Is the text specific and action-oriented ("Start Free Trial") or vague ("Submit", "Go", "Learn More", "Click Here")?
- Does the CTA communicate a clear outcome or benefit?
- Is there a single dominant CTA or are there multiple competing CTAs causing decision paralysis?
- On mobile, is the button large enough to tap easily (min 44px height)?
- What is the button color contrast against its background?

Be brutally honest. Quote the actual CTA text you found. Never give generic advice — always reference what you actually see on this specific page.`,

  scoringRubric: {
    0:  'No CTA found, CTA is invisible/broken, or page has zero clickable conversion action',
    4:  'CTA exists but uses generic text ("Submit", "Go", "Learn More"). Hard to spot. Below the fold.',
    7:  'Decent CTA with okay copy but lacks urgency, specificity, or benefit. Could be much stronger.',
    10: 'Perfect: strong benefit-driven CTA ("Get Instant Access Free"), above fold, high contrast, single focus'
  }
}