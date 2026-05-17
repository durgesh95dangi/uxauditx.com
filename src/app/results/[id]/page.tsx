import { AuditReport } from '@/components/AuditReport';
import { PendingAuditLinker } from '@/components/PendingAuditLinker';
import { supabase } from '@/lib/supabase';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import './report.css';

export const dynamic = 'force-dynamic';

export default async function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ssrSupabase = await createClient();
  const {
    data: { user },
  } = await ssrSupabase.auth.getUser();

  const { data: audit, error } = await supabase
    .from('audits')
    .select('*')
    .eq('id', id)
    .single();

  if (!audit || error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0C0F1A] font-sans text-white">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold">Report Not Found</h1>
          <p className="mb-6 text-white/60">We couldn&apos;t find this audit report.</p>
          <Link href="/">
            <button className="rounded border border-white/20 px-4 py-2 text-white/80 transition hover:bg-white/5">Return Home</button>
          </Link>
        </div>
      </div>
    );
  }

  if (audit.status !== 'complete' || !audit.results) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0C0F1A] font-sans text-white">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold">Analysis in Progress</h1>
          <p className="mb-6 text-white/60">Your results are still being generated. Please refresh in a moment.</p>
          <a href={`/results/${id}`} className="inline-block rounded border border-white/20 px-4 py-2 text-white/80 transition hover:bg-white/5">
            Refresh
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <PendingAuditLinker auditId={id} />
      <AuditReport audit={audit} isLoggedIn={!!user} />
    </>
  );
}
