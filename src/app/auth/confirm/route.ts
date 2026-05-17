import { createClient } from '@/utils/supabase/server'
import { type EmailOtpType } from '@supabase/supabase-js'
import { claimPendingAuditsForUser } from '@/lib/audit-ownership'
import { getSafePostAuthPath } from '@/lib/auth-redirects'
import { isValidAuditId, PENDING_AUDIT_COOKIE } from '@/lib/pending-audit'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const redirectTo = getSafePostAuthPath(
    searchParams.get('next') || searchParams.get('redirect_to') || '/dashboard'
  )

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://uxauditx.com'

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })

    if (!error) {
      // Link the anonymous audit results to the newly verified user
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const cookieStore = await cookies()
        const pendingAuditId = cookieStore.get(PENDING_AUDIT_COOKIE)?.value

        await claimPendingAuditsForUser(user, {
          redirectPath: redirectTo,
          claimAuditId: searchParams.get('claim_audit'),
          pendingAuditId: isValidAuditId(pendingAuditId) ? pendingAuditId : null,
        })
      }

      const response = NextResponse.redirect(new URL(redirectTo, siteUrl))
      response.cookies.set(PENDING_AUDIT_COOKIE, '', { path: '/', maxAge: 0 })
      return response
    }
  }

  // Return to login with error details if verification fails
  return NextResponse.redirect(
    new URL(`/login?message=${encodeURIComponent('Email verification failed or link expired.')}`, siteUrl)
  )
}
