// const PRODUCTION_APP_ORIGIN = 'https://uxauditx.com'
// const AUTH_CALLBACK_PATH = '/auth/callback'
// const DEFAULT_POST_AUTH_PATH = '/'
// const RESET_PASSWORD_PATH = '/reset-password'

// function normalizeOrigin(origin?: string | null) {
//   if (!origin) return null

//   try {
//     return new URL(origin).origin
//   } catch {
//     return null
//   }
// }

// function isLocalOrigin(origin: string) {
//   const { hostname } = new URL(origin)
//   return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1'
// }

// export function getAppOrigin(currentOrigin?: string | null) {
//   const requestOrigin = normalizeOrigin(currentOrigin)

//   if (requestOrigin && isLocalOrigin(requestOrigin)) {
//     return requestOrigin
//   }

//   const configuredOrigin = normalizeOrigin(process.env.NEXT_PUBLIC_APP_URL)
//   if (configuredOrigin) {
//     return configuredOrigin
//   }

//   return PRODUCTION_APP_ORIGIN
// }

// export function getSafePostAuthPath(redirectTo?: string | null, currentOrigin?: string | null) {
//   if (!redirectTo) return DEFAULT_POST_AUTH_PATH

//   if (redirectTo.startsWith('/') && !redirectTo.startsWith('//')) {
//     const url = new URL(redirectTo, PRODUCTION_APP_ORIGIN)
//     return `${url.pathname}${url.search}${url.hash}`
//   }

//   try {
//     const appOrigin = getAppOrigin(currentOrigin)
//     const url = new URL(redirectTo)
//     if (url.origin === appOrigin) {
//       return `${url.pathname}${url.search}${url.hash}`
//     }
//   } catch {
//     // Invalid redirect targets fall through to the safe default.
//   }

//   return DEFAULT_POST_AUTH_PATH
// }

// export function getAuthCallbackUrl(
//   redirectTo: string = DEFAULT_POST_AUTH_PATH,
//   currentOrigin?: string | null
// ) {
//   const appOrigin = getAppOrigin(currentOrigin)
//   const callbackUrl = new URL(AUTH_CALLBACK_PATH, appOrigin)
//   callbackUrl.searchParams.set('redirect_to', getSafePostAuthPath(redirectTo, appOrigin))
//   return callbackUrl.toString()
// }

// export function getSignupRedirectOptions(
//   redirectTo: string = DEFAULT_POST_AUTH_PATH,
//   currentOrigin?: string | null
// ) {
//   return {
//     emailRedirectTo: getAuthCallbackUrl(redirectTo, currentOrigin),
//   }
// }

// export function getMagicLinkRedirectOptions(
//   redirectTo: string = DEFAULT_POST_AUTH_PATH,
//   currentOrigin?: string | null
// ) {
//   return {
//     emailRedirectTo: getAuthCallbackUrl(redirectTo, currentOrigin),
//   }
// }

// export function getOAuthRedirectOptions(
//   redirectTo: string = DEFAULT_POST_AUTH_PATH,
//   currentOrigin?: string | null
// ) {
//   return {
//     redirectTo: getAuthCallbackUrl(redirectTo, currentOrigin),
//   }
// }

// export function getInviteRedirectOptions(
//   redirectTo: string = DEFAULT_POST_AUTH_PATH,
//   currentOrigin?: string | null
// ) {
//   return {
//     redirectTo: getAuthCallbackUrl(redirectTo, currentOrigin),
//   }
// }

// export function getPasswordResetRedirectOptions(currentOrigin?: string | null) {
//   return {
//     redirectTo: getAuthCallbackUrl(RESET_PASSWORD_PATH, currentOrigin),
//   }
// }
const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'https://uxauditx.com'

const AUTH_CALLBACK_PATH = '/auth/callback'
const DEFAULT_POST_AUTH_PATH = '/'
const RESET_PASSWORD_PATH = '/reset-password'

function buildRedirectUrl(path: string = DEFAULT_POST_AUTH_PATH) {
  const callbackUrl = new URL(`${APP_URL}${AUTH_CALLBACK_PATH}`)

  callbackUrl.searchParams.set(
    'redirect_to',
    path.startsWith('/') ? path : DEFAULT_POST_AUTH_PATH
  )

  return callbackUrl.toString()
}

export function getSignupRedirectOptions(
  redirectTo: string = DEFAULT_POST_AUTH_PATH
) {
  return {
    emailRedirectTo: buildRedirectUrl(redirectTo),
  }
}

export function getMagicLinkRedirectOptions(
  redirectTo: string = DEFAULT_POST_AUTH_PATH
) {
  return {
    emailRedirectTo: buildRedirectUrl(redirectTo),
  }
}

export function getOAuthRedirectOptions(
  redirectTo: string = DEFAULT_POST_AUTH_PATH
) {
  return {
    redirectTo: buildRedirectUrl(redirectTo),
  }
}

export function getInviteRedirectOptions(
  redirectTo: string = DEFAULT_POST_AUTH_PATH
) {
  return {
    redirectTo: buildRedirectUrl(redirectTo),
  }
}

export function getPasswordResetRedirectOptions() {
  return {
    redirectTo: buildRedirectUrl(RESET_PASSWORD_PATH),
  }
}