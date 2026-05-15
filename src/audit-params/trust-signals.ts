// src/audit-params/trust-signals.ts
import type { AuditParam } from '@/types'

export const trustSignals: AuditParam = {
  id: 'trust_signals',
  name: 'Trust Signals',
  category: 'trust',
  weight: 7,
  isFreePreview: false,

  description: 'Trust signals reduce purchase anxiety, especially near forms and CTAs. Missing trust signals are a silent conversion killer.',

  prompt: `Analyze TRUST SIGNALS on this webpage.

Look in both screenshots and extracted data for:
- SSL / security badges (especially near checkout or forms)
- Money-back guarantee or free trial reassurance
- Privacy assurance near email forms ("No spam, unsubscribe anytime")
- Contact information visible: phone number, email, physical address, live chat
- About page link or founder information
- Certifications, compliance badges (SOC 2, GDPR, ISO, etc.)
- Refund or cancellation policy mention
- "No credit card required" near signup CTAs
- Clear company identity (who runs this, where are they based)

Critical insight: trust signals must appear NEAR the conversion action (form, button) — not buried in the footer. A security badge in the footer that nobody sees is useless.

Rate where the trust signals appear, not just whether they exist.`,

  scoringRubric: {
    0:  'No trust signals. Anonymous site. Looks like it could be a scam.',
    4:  'Only a privacy link in footer. Nothing reassuring near forms or CTAs.',
    7:  'Some trust signals exist but not positioned near conversion points',
    10: 'Strong trust signals precisely placed: guarantee badge, security icon, no-spam notice near CTAs'
  }
}
