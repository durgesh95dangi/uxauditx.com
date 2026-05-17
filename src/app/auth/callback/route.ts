import { createClient } from '@/utils/supabase/server'
import { getAppOrigin, getSafePostAuthPath } from '@/lib/auth-redirects'
import { claimPendingAuditsForUser } from '@/lib/audit-ownership'
import { isValidAuditId, PENDING_AUDIT_COOKIE } from '@/lib/pending-audit'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url)
  const appOrigin = getAppOrigin(requestUrl.origin)
  const code = requestUrl.searchParams.get('code')
  const redirectTo = getSafePostAuthPath(
    requestUrl.searchParams.get('redirect_to'),
    appOrigin
  )

  const authError =
    requestUrl.searchParams.get('error_description') ||
    requestUrl.searchParams.get('error')

  if (authError && !code) {
    const message = authError.replace(/\+/g, ' ')
    return NextResponse.redirect(
      new URL(
        `/login?message=${encodeURIComponent(message)}&redirect=${encodeURIComponent(redirectTo)}`,
        appOrigin
      )
    )
  }

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      return NextResponse.redirect(
        new URL(
          `/login?message=${encodeURIComponent(error.message)}&redirect=${encodeURIComponent(redirectTo)}`,
          appOrigin
        )
      )
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const cookieStore = await cookies()
      const pendingAuditId = cookieStore.get(PENDING_AUDIT_COOKIE)?.value

      await claimPendingAuditsForUser(user, {
        redirectPath: redirectTo,
        claimAuditId: requestUrl.searchParams.get('claim_audit'),
        pendingAuditId: isValidAuditId(pendingAuditId) ? pendingAuditId : null,
      })
    }

    const response = NextResponse.redirect(new URL(redirectTo, appOrigin))
    response.cookies.set(PENDING_AUDIT_COOKIE, '', { path: '/', maxAge: 0 })
    return response
  }

  return NextResponse.redirect(
    new URL(
      `/login?message=${encodeURIComponent('Email verification failed or link expired.')}&redirect=${encodeURIComponent(redirectTo)}`,
      appOrigin
    )
  )
}
