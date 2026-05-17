import { createClient } from '@/utils/supabase/server'
import { getAppOrigin, getSafePostAuthPath } from '@/lib/auth-redirects'
import { claimRedirectedAuditForUser } from '@/lib/audit-ownership'
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
      await claimRedirectedAuditForUser(redirectTo, user)
    }

    return NextResponse.redirect(new URL(redirectTo, appOrigin))
  }

  return NextResponse.redirect(
    new URL(
      `/login?message=${encodeURIComponent('Email verification failed or link expired.')}&redirect=${encodeURIComponent(redirectTo)}`,
      appOrigin
    )
  )
}
