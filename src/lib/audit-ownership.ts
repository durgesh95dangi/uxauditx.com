import { supabase } from '@/lib/supabase'
import { isValidAuditId } from '@/lib/pending-audit'

const REPORT_PATH_PATTERN = /^\/results\/([0-9a-f-]+)\/?$/i

export function getAuditIdFromRedirectPath(redirectPath: string) {
  return redirectPath.match(REPORT_PATH_PATTERN)?.[1] ?? null
}

export async function claimAuditById(
  auditId: string,
  user: { id: string; email?: string | null }
): Promise<boolean> {
  if (!isValidAuditId(auditId)) return false

  const { data, error } = await supabase
    .from('audits')
    .update({
      user_id: user.id,
      ...(user.email ? { email: user.email } : {}),
    })
    .eq('id', auditId)
    .is('user_id', null)
    .select('id')
    .maybeSingle()

  if (error) {
    console.error('[claimAuditById]', auditId, error.message)
    return false
  }

  if (data) return true

  const { data: owned } = await supabase
    .from('audits')
    .select('id')
    .eq('id', auditId)
    .eq('user_id', user.id)
    .maybeSingle()

  return !!owned
}

/** Link anonymous audits captured with the same email before signup. */
export async function claimAuditsByEmail(user: { id: string; email?: string | null }) {
  if (!user.email) return

  const { error } = await supabase
    .from('audits')
    .update({ user_id: user.id })
    .eq('email', user.email)
    .is('user_id', null)

  if (error) {
    console.error('[claimAuditsByEmail]', user.email, error.message)
  }
}

export function collectAuditIdsToClaim(options: {
  redirectPath?: string | null
  claimAuditId?: string | null
  pendingAuditId?: string | null
  formAuditId?: string | null
}): string[] {
  const ids = new Set<string>()

  for (const candidate of [
    options.claimAuditId,
    options.pendingAuditId,
    options.formAuditId,
    options.redirectPath ? getAuditIdFromRedirectPath(options.redirectPath) : null,
  ]) {
    if (isValidAuditId(candidate)) ids.add(candidate)
  }

  return [...ids]
}

export async function claimPendingAuditsForUser(
  user: { id: string; email?: string | null },
  options: {
    redirectPath?: string | null
    claimAuditId?: string | null
    pendingAuditId?: string | null
    formAuditId?: string | null
  } = {}
) {
  const auditIds = collectAuditIdsToClaim(options)

  for (const auditId of auditIds) {
    await claimAuditById(auditId, user)
  }

  await claimAuditsByEmail(user)
}

export async function claimRedirectedAuditForUser(
  redirectPath: string,
  user: { id: string; email?: string | null }
) {
  await claimPendingAuditsForUser(user, { redirectPath })
}
