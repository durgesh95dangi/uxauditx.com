import { claimPendingAuditsForUser } from '@/lib/audit-ownership'
import { fetchUserAudits } from '@/lib/dashboard-audits'
import { isValidAuditId, PENDING_AUDIT_COOKIE } from '@/lib/pending-audit'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function getDashboardContext() {
  const ssrSupabase = await createClient()
  const {
    data: { user },
  } = await ssrSupabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/dashboard')
  }

  const cookieStore = await cookies()
  const pendingAuditId = cookieStore.get(PENDING_AUDIT_COOKIE)?.value
  await claimPendingAuditsForUser(user, {
    pendingAuditId: isValidAuditId(pendingAuditId) ? pendingAuditId : null,
  })

  const audits = await fetchUserAudits(user)

  return { user, audits }
}
