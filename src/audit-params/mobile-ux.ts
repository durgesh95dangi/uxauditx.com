// src/audit-params/mobile-ux.ts
import type { AuditParam } from '@/types'

export const mobileUx: AuditParam = {
  id: 'mobile_ux',
  name: 'Mobile UX',
  category: 'ux',
  weight: 6,
  isFreePreview: false,

  description: 'Over 55% of web traffic is mobile. A broken mobile experience means losing more than half of potential conversions.',

  prompt: `Analyze the MOBILE USER EXPERIENCE using the MOBILE SCREENSHOT (390px width).

Focus primarily on the mobile screenshot. Look for:
- Is the primary CTA button visible above the fold on mobile?
- Are tap targets large enough? (buttons should be at least 44px tall)
- Is text readable without zooming? (minimum 16px body text)
- Is the navigation usable on mobile (hamburger menu, etc.)?
- Is content squished, overflowing, or cut off?
- Is there a sticky CTA or is conversion buried below many scrolls?
- Do forms look usable on a touchscreen?
- Is the hero headline still compelling and legible on mobile?
- Do images load properly or appear broken?

Compare the desktop and mobile screenshots. If the mobile experience is significantly worse, that is a major problem.

Rate based on what you see in the MOBILE screenshot primarily.`,

  scoringRubric: {
    0:  'Completely broken on mobile. Content overflow, unreadable text, broken layout.',
    4:  'Technically functional but poor UX — tiny buttons, hard to read, CTA below fold',
    7:  'Mostly okay on mobile but has clear issues like small tap targets or buried CTA',
    10: 'Excellent mobile experience: large taps, readable text, CTA above fold, clean layout'
  }
}
