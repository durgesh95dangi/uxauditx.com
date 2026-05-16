import { createClient } from '@/utils/supabase/server'
import { getSafePostAuthPath } from '@/lib/auth-redirects'
import { claimRedirectedAuditForUser } from '@/lib/audit-ownership'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const redirectTo = getSafePostAuthPath(
    requestUrl.searchParams.get('redirect_to'),
    requestUrl.origin
  )

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)

    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await claimRedirectedAuditForUser(redirectTo, user)
    }
  }

  return NextResponse.redirect(new URL(redirectTo, requestUrl.origin))
}
