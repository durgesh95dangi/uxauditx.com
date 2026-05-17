import Link from 'next/link'
import { resendSignupConfirmationAction, signUpAction } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MailCheck, MonitorCheck, X } from 'lucide-react'
import { getAuditIdFromRedirectPath } from '@/lib/audit-ownership'
import { getSafePostAuthPath } from '@/lib/auth-redirects'

export default async function Signup({
  searchParams,
}: {
  searchParams: Promise<{
    confirmation?: string
    email?: string
    message?: string
    redirect?: string
    resendMessage?: string
  }>
}) {
  const { confirmation, email, message, redirect: redirectTo, resendMessage } = await searchParams
  const redirect = getSafePostAuthPath(redirectTo)
  const auditId = getAuditIdFromRedirectPath(redirect)
  const showConfirmationPopup = confirmation === 'sent' && !!email
  
  return (
    <div className="min-h-screen bg-[#09090b] text-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0f172a] border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0018F9] to-[#4D5FFF]" />
        
        <div className="flex justify-center mb-8">
          <Link href="/" className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0018F9] to-[#0018F9]/70 flex items-center justify-center shadow-lg shadow-[#0018F9]/25 border border-white/10">
            <MonitorCheck className="w-6 h-6 text-white" />
          </Link>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-white mb-2">Create an account</h2>
        <p className="text-slate-400 text-center mb-8">Sign up to unlock all 12 CRO parameters and download full PDF reports.</p>

        <form action={signUpAction} className="space-y-4">
          <input type="hidden" name="redirect" value={redirect} />
          {auditId && <input type="hidden" name="audit_id" value={auditId} />}
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
            <Input 
              name="email"
              type="email"
              placeholder="you@company.com"
              required
              className="bg-[#09090b] border-white/10 text-white h-12 focus-visible:ring-[#0018F9]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <Input 
              name="password"
              type="password"
              placeholder="••••••••"
              required
              minLength={6}
              className="bg-[#09090b] border-white/10 text-white h-12 focus-visible:ring-[#0018F9]"
            />
          </div>

          {message && (
            <p className="text-sm text-center font-medium bg-white/5 p-3 rounded-md border border-white/10 text-emerald-400 mt-4">
              {message}
            </p>
          )}

          <Button 
            type="submit" 
            className="w-full h-12 bg-gradient-to-r from-[#0018F9] to-[#0018F9]/80 hover:from-[#0018F9]/90 hover:to-[#0018F9]/70 text-white font-bold text-base mt-4 shadow-lg shadow-[#0018F9]/25"
          >
            Sign Up
          </Button>
        </form>

        <p className="text-center text-slate-400 mt-8 text-sm">
          Already have an account?{' '}
          <Link href={`/login?redirect=${encodeURIComponent(redirect)}`} className="text-white font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>

      {showConfirmationPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="signup-confirmation-title"
            className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0f172a] p-6 shadow-2xl"
          >
            <Link
              href={`/signup?redirect=${encodeURIComponent(redirect)}`}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-md p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Link>

            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <MailCheck className="h-6 w-6" />
            </div>

            <h2 id="signup-confirmation-title" className="pr-8 text-xl font-semibold text-white">
              Verify your email
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              We have sent a verification email to <span className="font-medium text-white">{email}</span>.
              Open that email and click the confirmation link to activate your account.
            </p>

            {resendMessage && (
              <p className="mt-4 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-emerald-400">
                {resendMessage}
              </p>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <form action={resendSignupConfirmationAction} className="flex-1">
                <input type="hidden" name="email" value={email} />
                <input type="hidden" name="redirect" value={redirect} />
                {auditId && <input type="hidden" name="audit_id" value={auditId} />}
                <Button
                  type="submit"
                  className="h-11 w-full bg-[#0018F9] font-semibold text-white hover:bg-[#0018F9]/90"
                >
                  Resend email
                </Button>
              </form>
              <Link
                href={`/signup?redirect=${encodeURIComponent(redirect)}`}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-md border border-white/10 px-4 text-sm font-medium text-slate-200 transition-colors hover:bg-white/5"
              >
                Close
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
