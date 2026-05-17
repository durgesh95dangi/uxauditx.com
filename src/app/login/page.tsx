import Link from 'next/link'
import { signInAction } from '@/app/auth/actions'
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
  linkAccent,
  linkInline,
} from '@/design-system'
import { MonitorCheck } from 'lucide-react'
import { getSafePostAuthPath } from '@/lib/auth-redirects'

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; redirect?: string }>
}) {
  const { message, redirect: redirectTo } = await searchParams
  const redirect = getSafePostAuthPath(redirectTo)

  return (
    <div className={authShell}>
      <div className={authCard}>
        <div className={authCardAccent} />

        <div className="mb-8 flex justify-center">
          <Link href="/" className={brandMarkLg}>
            <MonitorCheck className="h-6 w-6" />
          </Link>
        </div>

        <h2 className={authTitle}>Welcome back</h2>
        <p className={authDescription}>Sign in to access your full conversion reports.</p>

        <form action={signInAction} className="space-y-4">
          <input type="hidden" name="redirect" value={redirect} />

          <div>
            <label className={formLabel}>Email address</label>
            <Input name="email" type="email" placeholder="you@company.com" required inputSize="lg" />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className={formLabel}>Password</label>
              <Link href="/forgot-password" className={`text-xs ${linkAccent}`}>
                Forgot password?
              </Link>
            </div>
            <Input name="password" type="password" placeholder="••••••••" required inputSize="lg" />
          </div>

          {message && <p className={authMessage}>{message}</p>}

          <Button type="submit" size="xl" className="mt-2 w-full">
            Sign in
          </Button>
        </form>

        <p className={authFooter}>
          Don&apos;t have an account?{' '}
          <Link
            href={`/signup?redirect=${encodeURIComponent(redirect)}`}
            className={linkInline}
          >
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  )
}
