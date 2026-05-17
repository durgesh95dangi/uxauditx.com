import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { claimPendingAuditsForUser } from '@/lib/audit-ownership'
import { isValidAuditId, PENDING_AUDIT_COOKIE } from '@/lib/pending-audit'
import { createClient } from '@/utils/supabase/server'

const schema = z.object({
  auditId: z.string().uuid().optional(),
})

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let auditId: string | undefined
  try {
    const body = await req.json()
    auditId = schema.parse(body).auditId
  } catch {
    auditId = undefined
  }

  const pendingFromCookie = req.cookies.get(PENDING_AUDIT_COOKIE)?.value

  await claimPendingAuditsForUser(user, {
    claimAuditId: auditId,
    pendingAuditId: isValidAuditId(pendingFromCookie) ? pendingFromCookie : null,
  })

  const response = NextResponse.json({ ok: true })
  response.cookies.set(PENDING_AUDIT_COOKIE, '', {
    path: '/',
    maxAge: 0,
  })

  return response
}
