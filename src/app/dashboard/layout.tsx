import { signOutAction } from '@/app/auth/actions';
import { createClient } from '@/utils/supabase/server';
import { LogOut, MonitorCheck } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ssrSupabase = await createClient();
  const {
    data: { user },
  } = await ssrSupabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/dashboard');
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-50 font-sans">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-[#0f172a]/80 px-6 py-4 backdrop-blur-md md:px-12">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-gradient-to-br from-[#0018F9] to-[#0018F9]/70 shadow-sm">
            <MonitorCheck className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            UXAudit<span className="text-[#4D5FFF]">X</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-slate-400 sm:block">{user.email}</span>
          <form action={signOutAction}>
            <button type="submit" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-white/5 hover:text-white">
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </form>
        </div>
      </header>

      {children}
    </div>
  );
}
