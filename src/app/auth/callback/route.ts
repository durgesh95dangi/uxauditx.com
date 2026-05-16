import { createClient } from '@/utils/supabase/server'
import { getAppOrigin, getSafePostAuthPath } from '@/lib/auth-redirects'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const appOrigin = getAppOrigin(requestUrl.origin)
  const redirectTo = getSafePostAuthPath(requestUrl.searchParams.get('redirect_to'), appOrigin)

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL(redirectTo, appOrigin))
}
