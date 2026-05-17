'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

/**
 * Supabase may redirect failed email confirmations with errors in the URL hash
 * (e.g. #error=access_denied&error_code=otp_expired). Server routes cannot read hashes.
 */
export function AuthHashErrorHandler() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!window.location.hash.includes('error=')) return

    const hashParams = new URLSearchParams(window.location.hash.slice(1))
    const errorCode = hashParams.get('error_code')
    const description =
      hashParams.get('error_description')?.replace(/\+/g, ' ') ||
      hashParams.get('error') ||
      'Email verification failed.'

    const message =
      errorCode === 'otp_expired'
        ? 'This confirmation link has expired. Sign in or request a new verification email.'
        : description

    const redirect = pathname.startsWith('/') ? pathname : '/'
    const loginUrl = `/login?message=${encodeURIComponent(message)}&redirect=${encodeURIComponent(redirect)}`

    window.history.replaceState(null, '', pathname + window.location.search)
    router.replace(loginUrl)
  }, [pathname, router])

  return null
}
