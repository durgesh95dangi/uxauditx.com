export const PENDING_AUDIT_COOKIE = 'uxauditx_pending_audit'

export function isValidAuditId(value: string | null | undefined): value is string {
  if (!value) return false
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
}
