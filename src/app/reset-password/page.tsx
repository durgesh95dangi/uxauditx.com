import { resetPasswordAction } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MonitorCheck } from 'lucide-react'

export default function ResetPassword({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  return (
    <div className="min-h-screen bg-[#09090b] text-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0f172a] border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0018F9] to-[#4D5FFF]" />
        
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0018F9] to-[#0018F9]/70 flex items-center justify-center shadow-lg shadow-[#0018F9]/25 border border-white/10">
            <MonitorCheck className="w-6 h-6 text-white" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-white mb-2">Create New Password</h2>
        <p className="text-slate-400 text-center mb-8">Please enter your new password below.</p>

        <form action={resetPasswordAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">New Password</label>
            <Input 
              name="password"
              type="password"
              placeholder="••••••••"
              required
              minLength={6}
              className="bg-[#09090b] border-white/10 text-white h-12 focus-visible:ring-[#0018F9]"
            />
          </div>

          {searchParams?.message && (
            <p className="text-sm text-center font-medium bg-white/5 p-3 rounded-md border border-white/10 text-emerald-400 mt-4">
              {searchParams.message}
            </p>
          )}

          <Button 
            type="submit" 
            className="w-full h-12 bg-gradient-to-r from-[#0018F9] to-[#0018F9]/80 hover:from-[#0018F9]/90 hover:to-[#0018F9]/70 text-white font-bold text-base mt-4 shadow-lg shadow-[#0018F9]/25"
          >
            Update Password
          </Button>
        </form>
      </div>
    </div>
  )
}
