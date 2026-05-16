import Link from 'next/link'
import { forgotPasswordAction } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MonitorCheck, ArrowLeft } from 'lucide-react'

export default async function ForgotPassword({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>
}) {
  const { message } = await searchParams
  return (
    <div className="min-h-screen bg-[#09090b] text-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0f172a] border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0018F9] to-[#4D5FFF]" />
        
        <div className="mb-6">
          <Link href="/login" className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to login
          </Link>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
        <p className="text-slate-400 mb-8">Enter your email address and we'll send you a link to reset your password.</p>

        <form action={forgotPasswordAction} className="space-y-4">
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

          {message && (
            <p className="text-sm text-center font-medium bg-white/5 p-3 rounded-md border border-white/10 text-emerald-400 mt-4">
              {message}
            </p>
          )}

          <Button 
            type="submit" 
            className="w-full h-12 bg-gradient-to-r from-[#0018F9] to-[#0018F9]/80 hover:from-[#0018F9]/90 hover:to-[#0018F9]/70 text-white font-bold text-base mt-4 shadow-lg shadow-[#0018F9]/25"
          >
            Send Reset Link
          </Button>
        </form>
      </div>
    </div>
  )
}
