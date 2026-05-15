// src/audit-params/form-friction.ts
import type { AuditParam } from '@/types'

export const formFriction: AuditParam = {
  id: 'form_friction',
  name: 'Form Friction',
  category: 'ux',
  weight: 6,
  isFreePreview: false,

  description: 'Every unnecessary form field reduces completion rate by ~10%. Forms are often the final barrier between visitor and conversion.',

  prompt: `Analyze FORM FRICTION on this webpage.

Using the extracted form fields and screenshots, look for:
- How many fields does the primary conversion form have?
- Does it ask for information it does not strictly need at this stage? (e.g. phone number for a newsletter)
- Are field labels and placeholders clear?
- Is there a single-field email capture (low friction) or a 8-field registration form?
- Is the form above the fold or requiring significant scroll?
- Is there a CAPTCHA (high friction)?
- What happens after form submit — is there a clear success state?
- Are required vs optional fields marked?
- If there is NO form, how is conversion happening (CTA button to pricing, etc.)?

Fewer fields = higher conversion. Every field you remove increases submissions.
Asking for phone number when you don't need it loses 40%+ of people.`,

  scoringRubric: {
    0:  'Massive form with 8+ fields, asking for unnecessary info, no labels, confusing',
    4:  'Too many fields (5+) or asking for data not needed at this stage (e.g. company size for a free trial)',
    7:  'Reasonable form but has 1-2 unnecessary fields or unclear labels',
    10: 'Minimal, purposeful form. Only asks what is strictly needed. Clear labels. Single clear action.'
  }
}
