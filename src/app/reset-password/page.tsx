import { resetPasswordAction } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  authCard,
  authCardAccent,
  authDescription,
  authMessage,
  authShell,
  authTitle,
  brandMarkLg,
  formLabel,
} from '@/design-system'
import { MonitorCheck } from 'lucide-react'

export default function ResetPassword({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  return (
    <div className={authShell}>
      <div className={authCard}>
        <div className={authCardAccent} />

        <div className="mb-8 flex justify-center">
          <div className={brandMarkLg}>
            <MonitorCheck className="h-6 w-6" />
          </div>
        </div>

        <h2 className={authTitle}>Create new password</h2>
        <p className={authDescription}>Please enter your new password below.</p>

        <form action={resetPasswordAction} className="space-y-4">
          <div>
            <label className={formLabel}>New password</label>
            <Input
              name="password"
              type="password"
              placeholder="••••••••"
              required
              minLength={6}
              inputSize="lg"
            />
          </div>

          {searchParams?.message && <p className={authMessage}>{searchParams.message}</p>}

          <Button type="submit" size="xl" className="mt-2 w-full">
            Update password
          </Button>
        </form>
      </div>
    </div>
  )
}
