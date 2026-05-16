import { AuditReport } from '@/components/AuditReport';
import { supabase } from '@/lib/supabase';
import { createClient } from '@/utils/supabase/server';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import '../../../results/[id]/report.css';

export const dynamic = 'force-dynamic';

export default async function DashboardReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ssrSupabase = await createClient();
  const {
    data: { user },
  } = await ssrSupabase.auth.getUser();

  const { data: audit } = await supabase
    .from('audits')
    .select('*')
    .eq('id', id)
    .or(`user_id.eq.${user?.id},email.eq.${user?.email}`)
    .single();

  if (!audit) {
    notFound();
  }

  if (audit.status !== 'complete' || !audit.results) {
    return (
      <main className="px-4 py-10 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center gap-4">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-300 transition-colors hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              Back to reports
            </Link>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#0f172a] p-8">
            <h1 className="text-2xl font-semibold text-white">Analysis in Progress</h1>
            <p className="mt-2 text-slate-400">This report is still being generated. Refresh in a moment.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="border-b border-white/10 bg-[#09090b] px-4 py-5 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href="/dashboard" className="mb-2 inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              Back to reports
            </Link>
            <h1 className="text-xl font-semibold text-white">{audit.url_domain || audit.url}</h1>
          </div>
          <p className="max-w-xl truncate text-sm text-slate-400">{audit.url}</p>
        </div>
      </div>

      <AuditReport audit={audit} isLoggedIn showAccountActions={false} dashboardMode />
    </main>
  );
}
