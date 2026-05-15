'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export async function signInAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const redirectTo = formData.get('redirect') as string || '/'

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
  const redirectTo = formData.get('redirect') as string || '/'
  
  const headersList = await headers()
  const origin = headersList.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback?redirect_to=${encodeURIComponent(redirectTo)}`,
    },
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
  const origin = headersList.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  
  const supabase = await createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/reset-password`,
  })

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
