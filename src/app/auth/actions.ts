'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import {
  getPasswordResetRedirectOptions,
  getSafePostAuthPath,
  getSignupRedirectOptions,
} from '@/lib/auth-redirects'

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

  redirect(redirectTo)
}

export async function signUpAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const redirectTo = getSafePostAuthPath(formData.get('redirect') as string | null)
  
  const headersList = await headers()
  const origin = headersList.get('origin')

  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: getSignupRedirectOptions(redirectTo, origin),
  })

  if (error) {
    redirect(`/signup?message=${encodeURIComponent(error.message)}&redirect=${encodeURIComponent(redirectTo)}`)
  }

  // Redirect with confirmation message
  redirect(`/signup?message=${encodeURIComponent('Check your email to confirm your account')}&redirect=${encodeURIComponent(redirectTo)}`)
}

export async function signOutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

export async function forgotPasswordAction(formData: FormData) {
  const email = formData.get('email') as string
  
  const headersList = await headers()
  const origin = headersList.get('origin')
  
  const supabase = await createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(
    email,
    getPasswordResetRedirectOptions(origin)
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
