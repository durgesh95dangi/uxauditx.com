'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import {
  getSignupRedirectOptions,
  getPasswordResetRedirectOptions,
  getSafePostAuthPath,
} from '@/lib/auth-redirects'
import { claimPendingAuditsForUser } from '@/lib/audit-ownership'
import { isValidAuditId, PENDING_AUDIT_COOKIE } from '@/lib/pending-audit'
import { cookies } from 'next/headers'

async function claimAuditsAfterAuth(
  user: { id: string; email?: string | null },
  redirectTo: string,
  formAuditId?: string | null
) {
  const cookieStore = await cookies()
  const pendingAuditId = cookieStore.get(PENDING_AUDIT_COOKIE)?.value

  await claimPendingAuditsForUser(user, {
    redirectPath: redirectTo,
    formAuditId,
    pendingAuditId: isValidAuditId(pendingAuditId) ? pendingAuditId : null,
  })
}

export async function signInAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const redirectTo = getSafePostAuthPath(formData.get('redirect') as string | null)

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    redirect(`/login?message=${encodeURIComponent(error.message)}&redirect=${encodeURIComponent(redirectTo)}`)
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    await claimAuditsAfterAuth(user, redirectTo)
  }

  redirect(redirectTo)
}

export async function signUpAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const redirectTo = getSafePostAuthPath(formData.get('redirect') as string | null)
  const formAuditId = formData.get('audit_id') as string | null

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    // Never pass request Origin — proxies/tunnels can send localhost and get baked into the email link.
    options: getSignupRedirectOptions(redirectTo),
  })

  if (error) {
    redirect(`/signup?message=${encodeURIComponent(error.message)}&redirect=${encodeURIComponent(redirectTo)}`)
  }

  if (data.user) {
    await claimAuditsAfterAuth(data.user, redirectTo, formAuditId)
  }

  if (data.session) {
    redirect(redirectTo)
  }

  redirect(
    `/signup?confirmation=sent&email=${encodeURIComponent(email)}&redirect=${encodeURIComponent(redirectTo)}`
  )
}

export async function resendSignupConfirmationAction(formData: FormData) {
  const email = formData.get('email') as string
  const redirectTo = getSafePostAuthPath(formData.get('redirect') as string | null)
  const supabase = await createClient()

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: getSignupRedirectOptions(redirectTo),
  })

  if (error) {
    redirect(
      `/signup?confirmation=sent&email=${encodeURIComponent(email)}&resendMessage=${encodeURIComponent(error.message)}&redirect=${encodeURIComponent(redirectTo)}`
    )
  }

  redirect(
    `/signup?confirmation=sent&email=${encodeURIComponent(email)}&resendMessage=${encodeURIComponent('Verification email resent')}&redirect=${encodeURIComponent(redirectTo)}`
  )
}

export async function signOutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

export async function forgotPasswordAction(formData: FormData) {
  const email = formData.get('email') as string
  
  const supabase = await createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(
    email,
    getPasswordResetRedirectOptions()
  )

  if (error) {
    redirect(`/forgot-password?message=${encodeURIComponent(error.message)}`)
  }

  redirect(`/forgot-password?message=${encodeURIComponent('Check your email for a password reset link')}`)
}

export async function resetPasswordAction(formData: FormData) {
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    redirect(`/reset-password?message=${encodeURIComponent(error.message)}`)
  }

  redirect('/login?message=Password updated successfully. Please log in.')
}
