import Link from 'next/link'
import { resendSignupConfirmationAction, signUpAction } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  authCard,
  authCardAccent,
  authDescription,
  authFooter,
  authMessage,
  authShell,
  authTitle,
  brandMarkLg,
  formLabel,
  linkInline,
  linkMuted,
} from '@/design-system'
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
    <div className={authShell}>
      <div className={authCard}>
        <div className={authCardAccent} />

        <div className="mb-8 flex justify-center">
          <Link href="/" className={brandMarkLg}>
            <MonitorCheck className="h-6 w-6" />
          </Link>
        </div>

        <h2 className={authTitle}>Create an account</h2>
        <p className={authDescription}>
          Sign up to unlock all 12 CRO parameters and download full PDF reports.
        </p>

        <form action={signUpAction} className="space-y-4">
          <input type="hidden" name="redirect" value={redirect} />
          {auditId && <input type="hidden" name="audit_id" value={auditId} />}

          <div>
            <label className={formLabel}>Email address</label>
            <Input name="email" type="email" placeholder="you@company.com" required inputSize="lg" />
          </div>

          <div>
            <label className={formLabel}>Password</label>
            <Input
              name="password"
              type="password"
              placeholder="••••••••"
              required
              minLength={6}
              inputSize="lg"
            />
          </div>

          {message && <p className={authMessage}>{message}</p>}

          <Button type="submit" size="xl" className="mt-2 w-full">
            Sign up
          </Button>
        </form>

        <p className={authFooter}>
          Already have an account?{' '}
          <Link
            href={`/login?redirect=${encodeURIComponent(redirect)}`}
            className={linkInline}
          >
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
            className={`${authCard} p-6`}
          >
            <Link
              href={`/signup?redirect=${encodeURIComponent(redirect)}`}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-md p-2 text-app-muted transition-colors hover:bg-white/5 hover:text-app-foreground"
            >
              <X className="h-4 w-4" />
            </Link>

            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <MailCheck className="h-6 w-6" />
            </div>

            <h2 id="signup-confirmation-title" className="pr-8 text-xl font-semibold text-app-foreground">
              Verify your email
            </h2>
            <p className="mt-2 text-sm leading-6 text-app-muted-foreground">
              We have sent a verification email to{' '}
              <span className="font-medium text-app-foreground">{email}</span>. Open that email and
              click the confirmation link to activate your account.
            </p>

            {resendMessage && <p className={`mt-4 ${authMessage}`}>{resendMessage}</p>}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <form action={resendSignupConfirmationAction} className="flex-1">
                <input type="hidden" name="email" value={email} />
                <input type="hidden" name="redirect" value={redirect} />
                {auditId && <input type="hidden" name="audit_id" value={auditId} />}
                <Button type="submit" className="h-11 w-full">
                  Resend email
                </Button>
              </form>
              <Link
                href={`/signup?redirect=${encodeURIComponent(redirect)}`}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-md border border-app-border-strong px-4 text-sm font-medium text-app-muted-foreground transition-colors hover:bg-white/5 hover:text-app-foreground"
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
