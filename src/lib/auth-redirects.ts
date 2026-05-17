import { getAuditIdFromRedirectPath } from '@/lib/audit-ownership'

const PRODUCTION_APP_ORIGIN = 'https://uxauditx.com'
const AUTH_CALLBACK_PATH = '/auth/callback'
export const DEFAULT_POST_AUTH_PATH = '/dashboard'
const EMAIL_CONFIRMATION_REDIRECT_PATH = '/dashboard'
const RESET_PASSWORD_PATH = '/reset-password'

function normalizeOrigin(origin?: string | null) {
  if (!origin) return null

  try {
    return new URL(origin).origin
  } catch {
    return null
  }
}

function isLocalOrigin(origin: string) {
  const { hostname } = new URL(origin)
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1'
}

export function getAppOrigin(currentOrigin?: string | null) {
  const requestOrigin = normalizeOrigin(currentOrigin)

  // Only allow dynamic local requests in development mode to avoid container proxy host issues in production
  if (requestOrigin && isLocalOrigin(requestOrigin) && process.env.NODE_ENV !== 'production') {
    return requestOrigin
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL
  const configuredOrigin = normalizeOrigin(siteUrl)
  if (configuredOrigin) {
    return configuredOrigin
  }

  return PRODUCTION_APP_ORIGIN
}

export function getSafePostAuthPath(redirectTo?: string | null, currentOrigin?: string | null) {
  if (!redirectTo) return DEFAULT_POST_AUTH_PATH

  if (redirectTo.startsWith('/') && !redirectTo.startsWith('//')) {
    const url = new URL(redirectTo, PRODUCTION_APP_ORIGIN)
    return `${url.pathname}${url.search}${url.hash}`
  }

  try {
    const appOrigin = getAppOrigin(currentOrigin)
    const url = new URL(redirectTo)
    if (url.origin === appOrigin) {
      return `${url.pathname}${url.search}${url.hash}`
    }
  } catch {
    // Invalid redirect targets fall through to the safe default.
  }

  return DEFAULT_POST_AUTH_PATH
}

export function getAuthCallbackUrl(
  redirectTo: string = DEFAULT_POST_AUTH_PATH,
  currentOrigin?: string | null
) {
  const appOrigin = getAppOrigin(currentOrigin)
  const callbackUrl = new URL(AUTH_CALLBACK_PATH, appOrigin)
  callbackUrl.searchParams.set('redirect_to', getSafePostAuthPath(redirectTo, appOrigin))
  return callbackUrl.toString()
}

export function getSignupRedirectOptions(
  redirectTo: string = DEFAULT_POST_AUTH_PATH,
  currentOrigin?: string | null
) {
  const appOrigin = getAppOrigin(currentOrigin)
  const callbackUrl = new URL(AUTH_CALLBACK_PATH, appOrigin)
  callbackUrl.searchParams.set(
    'redirect_to',
    getSafePostAuthPath(EMAIL_CONFIRMATION_REDIRECT_PATH, appOrigin)
  )

  const auditId = getAuditIdFromRedirectPath(getSafePostAuthPath(redirectTo, appOrigin))
  if (auditId) {
    callbackUrl.searchParams.set('claim_audit', auditId)
  }

  return {
    emailRedirectTo: callbackUrl.toString(),
  }
}

export function getMagicLinkRedirectOptions(
  redirectTo: string = DEFAULT_POST_AUTH_PATH,
  currentOrigin?: string | null
) {
  return {
    emailRedirectTo: getAuthCallbackUrl(redirectTo, currentOrigin),
  }
}

export function getOAuthRedirectOptions(
  redirectTo: string = DEFAULT_POST_AUTH_PATH,
  currentOrigin?: string | null
) {
  return {
    redirectTo: getAuthCallbackUrl(redirectTo, currentOrigin),
  }
}

export function getInviteRedirectOptions(
  redirectTo: string = DEFAULT_POST_AUTH_PATH,
  currentOrigin?: string | null
) {
  return {
    redirectTo: getAuthCallbackUrl(redirectTo, currentOrigin),
  }
}

export function getPasswordResetRedirectOptions(currentOrigin?: string | null) {
  return {
    redirectTo: getAuthCallbackUrl(RESET_PASSWORD_PATH, currentOrigin),
  }
}
