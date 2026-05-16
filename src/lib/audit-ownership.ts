import { supabase } from '@/lib/supabase'

const REPORT_PATH_PATTERN = /^\/results\/([0-9a-f-]+)\/?$/i

export function getAuditIdFromRedirectPath(redirectPath: string) {
  return redirectPath.match(REPORT_PATH_PATTERN)?.[1] ?? null
}

export async function claimRedirectedAuditForUser(
  redirectPath: string,
  user: { id: string; email?: string | null }
) {
  const auditId = getAuditIdFromRedirectPath(redirectPath)

  if (!auditId) return

  await supabase
    .from('audits')
    .update({
      user_id: user.id,
      ...(user.email ? { email: user.email } : {}),
    })
    .eq('id', auditId)
    .is('user_id', null)
}
