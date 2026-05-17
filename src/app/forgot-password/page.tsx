import Link from 'next/link'
import { forgotPasswordAction } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  authCard,
  authCardAccent,
  authDescription,
  authShell,
  authMessage,
  authTitle,
  formLabel,
  linkMuted,
} from '@/design-system'
import { ArrowLeft } from 'lucide-react'

export default async function ForgotPassword({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>
}) {
  const { message } = await searchParams
  return (
    <div className={authShell}>
      <div className={authCard}>
        <div className={authCardAccent} />

        <div className="mb-6">
          <Link href="/login" className={linkMuted}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Link>
        </div>

        <h2 className={authTitle}>Reset password</h2>
        <p className={authDescription}>
          Enter your email address and we&apos;ll send you a link to reset your password.
        </p>

        <form action={forgotPasswordAction} className="space-y-4">
          <div>
            <label className={formLabel}>Email address</label>
            <Input name="email" type="email" placeholder="you@company.com" required inputSize="lg" />
          </div>

          {message && <p className={authMessage}>{message}</p>}

          <Button type="submit" size="xl" className="mt-2 w-full">
            Send reset link
          </Button>
        </form>
      </div>
    </div>
  )
}
