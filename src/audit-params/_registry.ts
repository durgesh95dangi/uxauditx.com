// src/audit-params/_registry.ts
import { ctaClarity }       from './cta-clarity'
import { headlineStrength } from './headline-strength'
import { socialProof }      from './social-proof'
import { trustSignals }     from './trust-signals'
import { valueProposition } from './value-proposition'
import { mobileUx }         from './mobile-ux'
import { formFriction }     from './form-friction'
import { pricingClarity }   from './pricing-clarity'
import { copyReadability }  from './copy-readability'
import { visualHierarchy }  from './visual-hierarchy'
import { pageSpeedSignals } from './page-speed-signals'
import { seoBasics }        from './seo-basics'
import type { AuditParam, ParamResult, Severity } from '@/types'

// ORDER MATTERS — this is the display order in reports
export const AUDIT_PARAMS: AuditParam[] = [
  ctaClarity,        // weight 10 — isFreePreview: true
  headlineStrength,  // weight 9  — isFreePreview: true
  socialProof,       // weight 8  — isFreePreview: true
  valueProposition,  // weight 8
  trustSignals,      // weight 7
  pricingClarity,    // weight 7
  mobileUx,          // weight 6
  formFriction,      // weight 6
  copyReadability,   // weight 5
  visualHierarchy,   // weight 5
  pageSpeedSignals,  // weight 4
  seoBasics,         // weight 3
]

export const FREE_PARAMS = AUDIT_PARAMS.filter(p => p.isFreePreview)
export const PAID_PARAMS = AUDIT_PARAMS.filter(p => !p.isFreePreview)

export function calcOverallScore(results: ParamResult[]): number {
  const totalPossible = AUDIT_PARAMS.reduce((s, p) => s + p.weight * 10, 0)
  const scored = results.reduce((s, r) => {
    const param = AUDIT_PARAMS.find(p => p.id === r.id)
    return s + r.score * (param?.weight ?? 1)
  }, 0)
  return Math.round((scored / totalPossible) * 100)
}

export function getSeverity(score: number): Severity {
  if (score <= 3) return 'critical'
  if (score <= 5) return 'high'
  if (score <= 7) return 'medium'
  return 'low'
}
