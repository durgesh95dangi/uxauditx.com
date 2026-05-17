import { createClient } from '@/utils/supabase/server'
import { type EmailOtpType } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { getSafePostAuthPath } from '@/lib/auth-redirects'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const redirectTo = getSafePostAuthPath(searchParams.get('next') || searchParams.get('redirect_to') || '/')

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
        const { claimRedirectedAuditForUser } = await import('@/lib/audit-ownership')
        await claimRedirectedAuditForUser(redirectTo, user)
      }

      return NextResponse.redirect(new URL(redirectTo, siteUrl))
    }
  }

  // Return to login with error details if verification fails
  return NextResponse.redirect(
    new URL(`/login?message=${encodeURIComponent('Email verification failed or link expired.')}`, siteUrl)
  )
}
