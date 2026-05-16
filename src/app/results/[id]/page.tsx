import { supabase } from '@/lib/supabase';
import { createClient } from '@/utils/supabase/server';
import { signOutAction } from '@/app/auth/actions';

export const dynamic = 'force-dynamic';
import { Lock, ArrowRight, LogIn, LogOut } from 'lucide-react';
import Link from 'next/link';
import './report.css';

export default async function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Check if user is authenticated
  const ssrSupabase = await createClient();
  const { data: { user } } = await ssrSupabase.auth.getUser();
  const isLoggedIn = !!user;

  // Fetch audit from the audits table (service role — bypasses RLS)
  const { data: audit, error } = await supabase
    .from('audits')
    .select('*')
    .eq('id', id)
    .single();

  if (!audit || error) {
    return (
      <div className="min-h-screen bg-[#0C0F1A] text-white flex items-center justify-center font-sans">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Report Not Found</h1>
          <p className="text-white/60 mb-6">We couldn&apos;t find this audit report.</p>
          <Link href="/">
            <button className="px-4 py-2 border border-white/20 rounded text-white/80 hover:bg-white/5 transition">Return Home</button>
          </Link>
        </div>
      </div>
    );
  }

  if (audit.status !== 'complete' || !audit.results) {
    return (
      <div className="min-h-screen bg-[#0C0F1A] text-white flex items-center justify-center font-sans">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Analysis in Progress</h1>
          <p className="text-white/60 mb-6">Your results are still being generated. Please refresh in a moment.</p>
          <a href={`/results/${id}`} className="px-4 py-2 border border-white/20 rounded text-white/80 hover:bg-white/5 transition inline-block">
            Refresh
          </a>
        </div>
      </div>
    );
  }

  // All 12 results stored as JSON in audit.results
  const allResults: any[] = audit.results || [];
  const freeResults = allResults.filter((r: any) => r.isFreePreview);
  const lockedResults = allResults.filter((r: any) => !r.isFreePreview);

  // If logged in — show ALL results, no locked section
  const displayResults = isLoggedIn ? allResults : freeResults;
  const showLocked = !isLoggedIn && lockedResults.length > 0;

  const overallScore = audit.overall_score || 0;
  const summary = audit.summary || '';

  const criticalCount = allResults.filter((r: any) => r.severity === 'critical').length;
  const highCount = allResults.filter((r: any) => r.severity === 'high').length;
  const mediumCount = allResults.filter((r: any) => r.severity === 'medium').length;
  const lowCount = allResults.filter((r: any) => r.severity === 'low').length;

  const formattedDate = new Date(audit.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  const getSeverityData = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return { tagClass: 'tag-crit', name: 'Critical', scoreCol: 'score-s1' };
      case 'high': return { tagClass: 'tag-high', name: 'High', scoreCol: 'score-s2' };
      case 'medium': return { tagClass: 'tag-med', name: 'Medium', scoreCol: 'score-s3' };
      case 'low': return { tagClass: 'tag-low', name: 'Low', scoreCol: 'score-s4' };
      default: return { tagClass: 'tag-cat', name: 'Unknown', scoreCol: 'score-s3' };
    }
  };

  const redirectParam = encodeURIComponent(`/results/${id}`);

  return (
    <div className="report-wrapper" style={{ backgroundColor: '#F8F6F1', minHeight: '100vh', display: 'block' }}>
      {isLoggedIn && (
        <div className="mx-auto flex max-w-[1040px] justify-end px-4 pt-4">
          <form action={signOutAction}>
            <button className="flex items-center gap-2 rounded-md border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--ink)] transition-colors hover:bg-[var(--paper-3)]">
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </form>
        </div>
      )}
      {/* ── COVER PAGE ── */}
      <div className="cover">
        <div className="cover-bar">
          <div className="cover-brand">Conversion Intelligence Report &nbsp;·&nbsp; Confidential</div>
          <div className="cover-date">Generated {formattedDate}</div>
        </div>
        <div className="cover-body">
          <div className="cover-eyebrow">CRO Audit — 12 Findings</div>
          <h1 className="cover-title">Where <span>{audit.url}</span><br />is losing customers</h1>
          <div className="cover-client">
            <div className="cover-client-dot"></div>
            <div className="cover-client-name">{audit.url} &nbsp;·&nbsp; Conversion Analysis</div>
          </div>
          <div className="cover-stats">
            <div className="cover-stat">
              <div className="cover-stat-num red">{overallScore}</div>
              <div className="cover-stat-label">Overall Score</div>
            </div>
            <div className="cover-stat">
              <div className="cover-stat-num red">{criticalCount}</div>
              <div className="cover-stat-label">Critical Issues</div>
            </div>
            <div className="cover-stat">
              <div className="cover-stat-num amber">{highCount}</div>
              <div className="cover-stat-label">High Priority</div>
            </div>
            <div className="cover-stat">
              <div className="cover-stat-num green">{mediumCount}</div>
              <div className="cover-stat-label">Medium Priority</div>
            </div>
          </div>
        </div>
        <div className="cover-footer">
          <div className="cover-footer-left">This report is prepared exclusively for {audit.url} and is not for redistribution.</div>
          <div className="cover-footer-right">v1.0 &nbsp;·&nbsp; Page 1 of 1</div>
        </div>
      </div>

      {/* ── EXECUTIVE SUMMARY ── */}
      <div className="page">
        <div className="section-eyebrow">Executive Summary</div>
        <h2 className="section-title">The short version — before the details</h2>
        <p className="section-sub">This report audits conversion-critical dimensions of the {audit.url} homepage and lead generation flow.</p>

        <div className="exec-block">
          <p>{summary}</p>
        </div>

        {/* Score Overview */}
        <div className="score-section">
          <div className="score-main">
            <div className="gauge-wrap">
              <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="70" cy="70" r="58" stroke="#EFECE5" strokeWidth="12" />
                <circle cx="70" cy="70" r="58" stroke="#C9922A" strokeWidth="12"
                  strokeDasharray="364.4" strokeDashoffset={`${364.4 - (364.4 * overallScore) / 100}`}
                  strokeLinecap="round"
                  transform="rotate(-90 70 70)" />
              </svg>
              <div className="gauge-num">
                <span>{overallScore}</span>
                <span>/ 100</span>
              </div>
            </div>
            <div className="score-right">
              <h3>Needs Significant Optimisation</h3>
              <p>The site has conversion blockers across multiple key parameters. Addressing the critical and high-priority issues first will have the fastest impact on revenue.</p>
              <div className="sev-row">
                <div className="sev-pill sev-crit"><span>{criticalCount}</span>Critical</div>
                <div className="sev-pill sev-high"><span>{highCount}</span>High</div>
                <div className="sev-pill sev-med"><span>{mediumCount}</span>Medium</div>
                <div className="sev-pill sev-low"><span>{lowCount}</span>Low</div>
              </div>
            </div>
          </div>

          <div className="chart-row">
            <div className="chart-card">
              <div className="chart-label">Scores by dimension</div>
              <div className="score-bars">
                {allResults.slice(0, Math.ceil(allResults.length / 2)).map((res: any, idx: number) => {
                  const sd = getSeverityData(res.severity);
                  const colorMap: Record<string, string> = { 'score-s1': 'var(--red)', 'score-s2': 'var(--amber)', 'score-s3': 'var(--blue)', 'score-s4': 'var(--green)' };
                  return (
                    <div className="sbar-row" key={idx}>
                      <div className="sbar-name truncate" title={res.name}>{res.name}</div>
                      <div className="sbar-track"><div className="sbar-fill" style={{ width: `${res.score * 10}%`, background: colorMap[sd.scoreCol] ?? 'var(--muted)' }}></div></div>
                      <div className="sbar-val">{res.score}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="chart-card">
              <div className="chart-label">&nbsp;</div>
              <div className="score-bars">
                {allResults.slice(Math.ceil(allResults.length / 2)).map((res: any, idx: number) => {
                  const sd = getSeverityData(res.severity);
                  const colorMap: Record<string, string> = { 'score-s1': 'var(--red)', 'score-s2': 'var(--amber)', 'score-s3': 'var(--blue)', 'score-s4': 'var(--green)' };
                  return (
                    <div className="sbar-row" key={idx}>
                      <div className="sbar-name truncate" title={res.name}>{res.name}</div>
                      <div className="sbar-track"><div className="sbar-fill" style={{ width: `${res.score * 10}%`, background: colorMap[sd.scoreCol] ?? 'var(--muted)' }}></div></div>
                      <div className="sbar-val">{res.score}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="divider"></div>

        {/* ── DETAILED FINDINGS ── */}
        <div className="section-eyebrow">Detailed Findings</div>
        <h2 className="section-title">
          {isLoggedIn ? 'All 12 Issues — Full Report' : `4 of ${allResults.length} Issues — Free Preview`}
        </h2>
        <p className="section-sub">Each finding includes the observed problem, root cause analysis, recommended action, and a rewrite example where relevant.</p>

        <div className="findings-grid">
          {displayResults.map((result: any, index: number) => {
            const sevData = getSeverityData(result.severity);
            const num = (index + 1).toString().padStart(2, '0');

            return (
              <div className="finding-card" key={result.id || index}>
                <div className="finding-header">
                  <div className="finding-num">{num}</div>
                  <div className="finding-header-body">
                    <div className="finding-tags">
                      <span className={`tag ${sevData.tagClass}`}>{sevData.name}</span>
                      <span className="tag tag-cat">{result.category || 'UX · Conversion'}</span>
                    </div>
                    <div className="finding-name">{result.name}</div>
                    <div className="finding-title-sub" style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>{result.title}</div>
                  </div>
                  <div className="finding-score-col">
                    <div className={`finding-score-num ${sevData.scoreCol}`}>{result.score}</div>
                    <div className="finding-score-max">/10</div>
                  </div>
                </div>
                <div className="finding-body">
                  <div className="finding-col">
                    <div className="finding-col-label">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="#7A7E8E" strokeWidth="1.2" /><path d="M7 5v2.5L8.5 9" stroke="#7A7E8E" strokeWidth="1.2" strokeLinecap="round" /></svg>
                      UX Analysis
                    </div>
                    <p>{result.problem}</p>
                    {result.example && (
                      <div className="finding-observed">
                        <div className="finding-observed-label">Rewrite Example</div>
                        <p style={{ fontStyle: 'italic' }}>{result.example}</p>
                      </div>
                    )}
                  </div>
                  <div className="finding-col">
                    <div className="finding-col-label">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M7 2l5 5-5 5" stroke="#7A7E8E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      Recommended Action
                    </div>
                    <p>{result.fix}</p>
                    {result.impact && (
                      <div className="finding-impact">
                        <div className="finding-impact-label">Business Impact</div>
                        <p>{result.impact}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── LOCKED SECTION (only for unauthenticated users) ── */}
        {showLocked && (
          <div className="mt-16">
            <div className="relative overflow-hidden rounded-xl border border-[var(--border)] bg-[#fff]">
              {/* Blurred preview of locked cards */}
              <div className="findings-grid p-6 opacity-30 filter blur-sm pointer-events-none select-none">
                {lockedResults.slice(0, 2).map((result: any, idx: number) => (
                  <div className="finding-card" key={idx}>
                    <div className="finding-header">
                      <div className="finding-num">{(freeResults.length + idx + 1).toString().padStart(2, '0')}</div>
                      <div className="finding-header-body">
                        <div className="finding-tags"><span className="tag tag-cat">Locked</span></div>
                        <div className="finding-name">{result.name}</div>
                      </div>
                    </div>
                    <div className="finding-body p-6">
                      <div className="h-4 bg-[var(--paper-3)] rounded w-full mb-3"></div>
                      <div className="h-4 bg-[var(--paper-3)] rounded w-5/6 mb-3"></div>
                      <div className="h-4 bg-[var(--paper-3)] rounded w-4/6"></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--paper)]/85 backdrop-blur-[3px] p-6 text-center">
                <Lock className="w-12 h-12 text-[var(--gold)] mb-4" />
                <h3 className="text-2xl font-serif text-[var(--ink)] mb-2">
                  {lockedResults.length} More Issues Found
                </h3>
                <p className="text-[var(--muted)] max-w-md mx-auto mb-2">
                  You've seen 4 of {allResults.length} conversion blockers. Sign up free to unlock the full report instantly — no credit card required.
                </p>
                <p className="text-[var(--muted)] text-sm max-w-sm mx-auto mb-8">
                  Includes: Mobile UX, Trust Signals, Form Friction, Pricing Clarity, Copy Readability, Visual Hierarchy, Page Speed & SEO.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href={`/signup?redirect=${redirectParam}`}>
                    <button className="px-8 py-4 bg-[#0018F9] text-white rounded-md font-semibold hover:bg-[#0018F9]/90 transition-colors flex items-center gap-2 shadow-lg shadow-[#0018F9]/25">
                      <ArrowRight className="w-4 h-4" />
                      Sign Up Free — Unlock All {allResults.length} Issues
                    </button>
                  </Link>
                  <Link href={`/login?redirect=${redirectParam}`}>
                    <button className="px-8 py-4 border border-[var(--border)] text-[var(--ink)] rounded-md font-medium hover:bg-[var(--paper-3)] transition-colors flex items-center gap-2">
                      <LogIn className="w-4 h-4" />
                      Already have an account? Log In
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── LOGGED IN — FULL REPORT ACTIONS ── */}
        {isLoggedIn && (
          <div className="mt-16 text-center py-8 border-t border-[var(--border)]">
            <p className="text-[var(--muted)] mb-4">You have access to the complete report.</p>
            <div className="flex gap-4 justify-center">
              <Link href="/dashboard">
                <button className="px-6 py-3 bg-[#0018F9] text-white rounded-md font-medium hover:bg-[#0018F9]/90 transition-colors">
                  View All My Reports
                </button>
              </Link>
              <Link href="/dashboard">
                <button className="px-6 py-3 border border-[var(--border)] text-[var(--ink)] rounded-md font-medium hover:bg-[var(--paper-3)] transition-colors">
                  Run Another Audit
                </button>
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
