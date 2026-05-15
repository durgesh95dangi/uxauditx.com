import { supabase } from '@/lib/supabase';
import { Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { UnlockReportForm } from '@/components/UnlockReportForm';
import './report.css';

export default async function ResultsPage({ params }: { params: { id: string } }) {
  const { id } = params;

  // Fetch scan details
  const { data: scanData } = await supabase
    .from('scans')
    .select('url, status, created_at')
    .eq('id', id)
    .single();

  if (!scanData) {
    return (
      <div className="min-h-screen bg-[#0C0F1A] text-white flex items-center justify-center font-sans">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Scan Not Found</h1>
          <p className="text-white/60 mb-6">We couldn't find the results for this scan.</p>
          <Link href="/">
            <button className="px-4 py-2 border border-white/20 rounded text-white/80 hover:bg-white/5 transition">Return Home</button>
          </Link>
        </div>
      </div>
    );
  }

  // Fetch audit results
  const { data: auditResults } = await supabase
    .from('audit_results')
    .select('*')
    .eq('scan_id', id)
    .order('is_free', { ascending: false }); // Free first

  if (!auditResults || auditResults.length === 0) {
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

  const freeResults = auditResults.filter(r => r.is_free);
  const lockedResults = auditResults.filter(r => !r.is_free);

  const criticalCount = auditResults.filter(r => r.severity.toLowerCase() === 'critical').length;
  const highCount = auditResults.filter(r => r.severity.toLowerCase() === 'high').length;
  const mediumCount = auditResults.filter(r => r.severity.toLowerCase() === 'medium').length;
  const lowCount = auditResults.filter(r => r.severity.toLowerCase() === 'low').length;

  const overallScore = Math.max(0, 100 - (criticalCount * 12) - (highCount * 8) - (mediumCount * 4));

  const getSeverityData = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return { tagClass: 'tag-crit', name: 'Critical', scoreCol: 'score-s1', defaultScore: 3 };
      case 'high': return { tagClass: 'tag-high', name: 'High', scoreCol: 'score-s2', defaultScore: 5 };
      case 'medium': return { tagClass: 'tag-med', name: 'Medium', scoreCol: 'score-s3', defaultScore: 7 };
      case 'low': return { tagClass: 'tag-low', name: 'Low', scoreCol: 'score-s4', defaultScore: 9 };
      default: return { tagClass: 'tag-cat', name: 'Unknown', scoreCol: 'score-s3', defaultScore: 5 };
    }
  };

  const formattedDate = new Date(scanData.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  return (
    <div className="report-wrapper" style={{ backgroundColor: '#F8F6F1', minHeight: '100vh', display: 'block' }}>
      {/* ── COVER PAGE ── */}
      <div className="cover">
        <div className="cover-bar">
          <div className="cover-brand">Conversion Intelligence Report &nbsp;·&nbsp; Confidential</div>
          <div className="cover-date">Generated {formattedDate}</div>
        </div>
        <div className="cover-body">
          <div className="cover-eyebrow">CRO Audit — 12 Findings</div>
          <h1 className="cover-title">Where <span>{scanData.url}</span><br />is losing customers</h1>
          <div className="cover-client">
            <div className="cover-client-dot"></div>
            <div className="cover-client-name">{scanData.url} &nbsp;·&nbsp; Conversion Analysis</div>
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
          <div className="cover-footer-left">This report is prepared exclusively for {scanData.url} and is not for redistribution.</div>
          <div className="cover-footer-right">v1.0 &nbsp;·&nbsp; Page 1 of 1</div>
        </div>
      </div>

      {/* ── EXECUTIVE SUMMARY ── */}
      <div className="page">
        <div className="section-eyebrow">Executive Summary</div>
        <h2 className="section-title">The short version — before the details</h2>
        <p className="section-sub">This report audits conversion-critical dimensions of the {scanData.url} homepage and lead generation flow.</p>

        <div className="exec-block">
          <p>{scanData.url} is operating with a <strong>conversion infrastructure that actively works against itself</strong>. While the core product offering appears solid, the presentation layers are creating significant friction. The assets are effectively invisible. They are either buried below the fold, absent near the moments when trust matters most (the form, the CTA), or framed in language that speaks to technical evaluators rather than decision-makers.</p>
          <p>The most urgent problems lie in the critical execution layers — overly complex forms, slow page loads, and unclear value propositions. Combined, these issues alone are likely responsible for the majority of lead drop-off.</p>
          <p>The <strong>good news:</strong> none of these are structural overhauls. They are execution-layer fixes — copy rewrites, form field removals, image compression, CTA consolidation. The path from a {overallScore} to a 70+ score is achievable in 60 days with focused effort. This report gives you the exact sequence.</p>
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
              <p>The site sits in the lower half of the conversion readiness scale. Critical failures in form design, mobile experience, and page speed are suppressing conversions daily. Trust signals and value proposition require immediate clarity work.</p>
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
                {auditResults.slice(0, Math.ceil(auditResults.length / 2)).map((res, idx) => {
                  const sd = getSeverityData(res.severity);
                  const colorMap: Record<string, string> = { 'score-s1': 'var(--red)', 'score-s2': 'var(--amber)', 'score-s3': 'var(--blue)', 'score-s4': 'var(--green)' };
                  return (
                    <div className="sbar-row" key={idx}>
                      <div className="sbar-name truncate" title={res.parameter_name}>{res.parameter_name}</div>
                      <div className="sbar-track"><div className="sbar-fill" style={{ width: `${sd.defaultScore * 10}%`, background: colorMap[sd.scoreCol] ?? 'var(--muted)' }}></div></div>
                      <div className="sbar-val">{sd.defaultScore}</div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="chart-card">
              <div className="chart-label">&nbsp;</div>
              <div className="score-bars">
                {auditResults.slice(Math.ceil(auditResults.length / 2)).map((res, idx) => {
                  const sd = getSeverityData(res.severity);
                  const colorMap: Record<string, string> = { 'score-s1': 'var(--red)', 'score-s2': 'var(--amber)', 'score-s3': 'var(--blue)', 'score-s4': 'var(--green)' };
                  return (
                    <div className="sbar-row" key={idx}>
                      <div className="sbar-name truncate" title={res.parameter_name}>{res.parameter_name}</div>
                      <div className="sbar-track"><div className="sbar-fill" style={{ width: `${sd.defaultScore * 10}%`, background: colorMap[sd.scoreCol] ?? 'var(--muted)' }}></div></div>
                      <div className="sbar-val">{sd.defaultScore}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="divider"></div>

        {/* ── DETAILED FINDINGS ── */}
        <div className="section-eyebrow">Detailed Findings</div>
        <h2 className="section-title">Issues, ranked by business impact</h2>
        <p className="section-sub">Each finding includes the observed problem, root cause analysis, recommended action, and a rewrite example where relevant.</p>

        <div className="findings-grid">
          {freeResults.map((result, index) => {
            const sevData = getSeverityData(result.severity);
            const num = (index + 1).toString().padStart(2, '0');

            return (
              <div className="finding-card" key={result.id}>
                <div className="finding-header">
                  <div className="finding-num">{num}</div>
                  <div className="finding-header-body">
                    <div className="finding-tags">
                      <span className={`tag ${sevData.tagClass}`}>{sevData.name}</span>
                      <span className="tag tag-cat">UX · Conversion</span>
                    </div>
                    <div className="finding-name">{result.parameter_name}</div>
                  </div>
                  <div className="finding-score-col">
                    <div className={`finding-score-num ${sevData.scoreCol}`}>{sevData.defaultScore}</div>
                    <div className="finding-score-max">/10</div>
                  </div>
                </div>
                <div className="finding-body">
                  <div className="finding-col">
                    <div className="finding-col-label">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="#7A7E8E" strokeWidth="1.2" /><path d="M7 5v2.5L8.5 9" stroke="#7A7E8E" strokeWidth="1.2" strokeLinecap="round" /></svg>
                      UX Analysis
                    </div>
                    <p>{result.issue_description}</p>
                    <div className="finding-observed">
                      <div className="finding-observed-label">Observed</div>
                      <p>Issue identified by UXAuditX AI Vision model.</p>
                    </div>
                  </div>
                  <div className="finding-col">
                    <div className="finding-col-label">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M7 2l5 5-5 5" stroke="#7A7E8E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      Recommended Action
                    </div>
                    <p>{result.recommendation}</p>
                    <div className="finding-impact">
                      <div className="finding-impact-label">Business Impact</div>
                      <p>Addressing this {sevData.name.toLowerCase()} issue will directly contribute to reducing friction and improving conversion velocity.</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── LOCKED FINDINGS ── */}
        {lockedResults.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center space-x-2 mb-8">
              <Lock className="w-5 h-5 text-[var(--muted)]" />
              <h2 className="text-xl font-semibold text-[var(--ink)]">Locked Insights ({lockedResults.length})</h2>
            </div>
            <div className="relative overflow-hidden rounded-xl border border-[var(--border)] bg-[#fff]">
              <div className="findings-grid p-6 opacity-30 filter blur-sm pointer-events-none select-none">
                {lockedResults.slice(0, 2).map((result, idx) => (
                  <div className="finding-card" key={result.id}>
                    <div className="finding-header">
                      <div className="finding-num">{(freeResults.length + idx + 1).toString().padStart(2, '0')}</div>
                      <div className="finding-header-body">
                        <div className="finding-tags">
                          <span className="tag tag-cat">Locked</span>
                        </div>
                        <div className="finding-name">Hidden Parameter</div>
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
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--paper)]/80 backdrop-blur-[2px] p-6 text-center">
                <Lock className="w-12 h-12 text-[var(--gold)] mb-4" />
                <h3 className="text-2xl font-serif text-[var(--ink)] mb-2">Unlock Full Audit</h3>
                <p className="text-[var(--muted)] max-w-md mx-auto mb-6">
                  Get access to all remaining parameters including Mobile Responsiveness, Trust Signals, Form Optimization, and more.
                </p>
                <UnlockReportForm scanId={id} />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
