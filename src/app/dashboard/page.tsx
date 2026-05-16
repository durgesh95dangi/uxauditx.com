import { supabase as adminSupabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { ExternalLink, Clock, BarChart3 } from 'lucide-react';
import { DashboardNewAudit } from '@/components/DashboardNewAudit';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const ssrSupabase = await createClient();
  const { data: { user } } = await ssrSupabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/dashboard');
  }

  // Fetch all audits for this user (by user_id or email)
  const { data: audits } = await adminSupabase
    .from('audits')
    .select('id, url, url_domain, overall_score, status, created_at, summary, results')
    .or(`user_id.eq.${user.id},email.eq.${user.email}`)
    .eq('status', 'complete')
    .order('created_at', { ascending: false });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-emerald-400';
    if (score >= 50) return 'text-amber-400';
    return 'text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 70) return 'bg-emerald-500/10 border-emerald-500/20';
    if (score >= 50) return 'bg-amber-500/10 border-amber-500/20';
    return 'bg-red-500/10 border-red-500/20';
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 md:px-8">
        {/* Page Title */}
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Audit Reports</h1>
            <p className="text-slate-400">All your CRO audit reports in one place. Each report includes the full 12-parameter analysis.</p>
          </div>
          {audits && audits.length > 0 && <DashboardNewAudit userEmail={user.email || ''} />}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-[#0f172a] border border-white/10 rounded-xl p-5">
            <div className="text-3xl font-bold text-white mb-1">{audits?.length || 0}</div>
            <div className="text-sm text-slate-400">Total Audits</div>
          </div>
          <div className="bg-[#0f172a] border border-white/10 rounded-xl p-5">
            <div className="text-3xl font-bold text-[#4D5FFF] mb-1">
              {audits && audits.length > 0
                ? Math.round(audits.reduce((sum, a) => sum + (a.overall_score || 0), 0) / audits.length)
                : '—'}
            </div>
            <div className="text-sm text-slate-400">Avg. CRO Score</div>
          </div>
          <div className="bg-[#0f172a] border border-white/10 rounded-xl p-5 col-span-2 md:col-span-1">
            <div className="text-3xl font-bold text-emerald-400 mb-1">
              {audits && audits.length > 0 ? audits.filter(a => (a.overall_score || 0) >= 70).length : 0}
            </div>
            <div className="text-sm text-slate-400">Healthy Sites (70+)</div>
          </div>
        </div>

        {/* Audit List */}
        {!audits || audits.length === 0 ? (
          <div className="text-center py-20 bg-[#0f172a] border border-white/10 rounded-2xl">
            <BarChart3 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No audits yet</h3>
            <p className="text-slate-400 mb-8">Run your first CRO audit to see results here.</p>
            <div className="mx-auto max-w-xl text-left">
              <DashboardNewAudit userEmail={user.email || ''} defaultOpen />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {audits.map((audit) => {
              const resultCount = (audit.results as any[])?.length || 0;
              return (
                <div key={audit.id} className="bg-[#0f172a] border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all group">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Score Badge */}
                    <div className={`flex-shrink-0 w-16 h-16 rounded-xl border flex flex-col items-center justify-center ${getScoreBg(audit.overall_score || 0)}`}>
                      <div className={`text-2xl font-bold ${getScoreColor(audit.overall_score || 0)}`}>
                        {audit.overall_score || '—'}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">/100</div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-semibold text-white truncate">{audit.url_domain || audit.url}</h3>
                        <a href={audit.url} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors flex-shrink-0">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                      <p className="text-sm text-slate-400 truncate mb-2">{audit.url}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(audit.created_at)}
                        </span>
                        <span className="flex items-center gap-1">
                          <BarChart3 className="w-3 h-3" />
                          {resultCount} parameters analyzed
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <Link href={`/dashboard/reports/${audit.id}`}>
                        <button className="px-4 py-2 text-sm font-medium text-white bg-[#0018F9] hover:bg-[#0018F9]/90 rounded-lg transition-colors">
                          View Report
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
    </main>
  );
}
