'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  MonitorCheck, ArrowLeft, Download, Lock, Unlock,
  AlertCircle, CheckCircle2, TrendingUp, Lightbulb,
  Globe, Calendar, Zap, Target, Shield, Eye, Smartphone,
  FileText, BarChart3, Search, Layers, Briefcase, Activity
} from 'lucide-react';
import Link from 'next/link';
import type { ParamResult } from '@/types';

// ── Category icon + mapping ──────────────────────────────────
const CATEGORY_ICONS: Record<string, any> = {
  conversion: Target,
  copy: FileText,
  trust: Shield,
  ux: Smartphone,
  seo: Search,
  performance: Zap,
  design: Layers,
};

// ── Severity config (Minimalist & Professional) ────────────────
const SEV_CONFIG: Record<string, { label: string; text: string; bg: string; dot: string; border: string }> = {
  critical: { label: 'Critical', text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-100', dot: 'bg-red-500' },
  high:     { label: 'High',     text: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-100', dot: 'bg-orange-500' },
  medium:   { label: 'Medium',   text: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-100', dot: 'bg-yellow-500' },
  low:      { label: 'Low',      text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-100', dot: 'bg-emerald-500' },
};

// ── Elegant Score Gauge ────────────────────────────────────────
function HealthGauge({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  
  // Premium muted colors
  const color = score >= 70 ? '#10b981' : score >= 45 ? '#f59e0b' : score >= 25 ? '#f97316' : '#ef4444';
  const label = score >= 70 ? 'Healthy' : score >= 45 ? 'Needs Optimization' : score >= 25 ? 'High Risk' : 'Critical Risk';

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="8" />
          <circle
            cx="64" cy="64" r={radius} fill="none"
            stroke={color} strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
          <span className="text-4xl font-extrabold text-slate-900 tracking-tight tabular-nums">{score}</span>
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest mt-0.5">Score</span>
        </div>
      </div>
      <span className="text-sm font-semibold text-slate-700">{label}</span>
    </div>
  );
}

// ── Mockup Frame Placeholder ──────────────────────────────────
function BrowserMockup({ url }: { url: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col h-full print:border-slate-300">
      {/* Browser Bar */}
      <div className="h-10 border-b border-slate-100 bg-slate-50/80 flex items-center px-4 gap-3">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="px-4 py-1 rounded-md bg-white border border-slate-200 text-[10px] text-slate-500 max-w-xs w-full text-center truncate shadow-sm">
            {url}
          </div>
        </div>
        <div className="w-10" /> {/* Balancer */}
      </div>
      {/* Mockup Body (Abstract Wireframe) */}
      <div className="flex-1 bg-white p-8 flex flex-col items-center justify-center border-t border-white">
        <div className="w-3/4 max-w-sm space-y-4 opacity-40">
          <div className="h-4 bg-slate-200 rounded w-1/3 mx-auto" />
          <div className="h-8 bg-slate-300 rounded w-full mx-auto" />
          <div className="h-2 bg-slate-200 rounded w-2/3 mx-auto" />
          <div className="h-10 bg-slate-800 rounded w-1/4 mx-auto mt-6" />
        </div>
        <p className="text-xs text-slate-400 mt-12 font-medium tracking-wide uppercase">Screenshot Analysis Enabled</p>
      </div>
    </div>
  );
}

// ── Editorial Issue Card ──────────────────────────────────────
function IssueReport({ result, index }: { result: ParamResult; index: number }) {
  const sev = SEV_CONFIG[result.severity] ?? SEV_CONFIG.medium;
  const CatIcon = CATEGORY_ICONS[result.category] ?? Target;

  return (
    <div className="mb-8 rounded-xl border border-slate-200 bg-white shadow-sm print:break-inside-avoid">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 shadow-sm flex items-center justify-center shrink-0">
            <CatIcon className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{result.category}</span>
              <span className="text-slate-300">•</span>
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold ${sev.bg} ${sev.text} ${sev.border} border`}>
                <span className={`w-1.5 h-1.5 rounded-full ${sev.dot}`} />
                {sev.label} Priority
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 leading-snug">{result.name}</h3>
          </div>
        </div>
        
        <div className="text-right shrink-0 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
          <div className="text-xl font-bold text-slate-900 leading-none">{result.score}<span className="text-xs text-slate-400 font-medium">/10</span></div>
        </div>
      </div>

      {/* Body: Editorial Grid */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column: Analysis */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-slate-400" />
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">UX Analysis</h4>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{result.problem}</p>
          </div>
          
          {result.title && (
            <div className="pl-4 border-l-2 border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Observed</span>
              <p className="text-sm text-slate-800 font-medium italic">"{result.title}"</p>
            </div>
          )}
        </div>

        {/* Right Column: Action */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-slate-400" />
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Recommended Action</h4>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{result.fix}</p>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Business Impact</span>
            <div className="flex items-start gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-sm text-slate-700 font-medium">{result.impact}</p>
            </div>
          </div>
        </div>

      </div>

      {/* Example Footer */}
      {result.example && result.example !== 'N/A' && (
        <div className="px-6 py-4 bg-slate-900 text-white rounded-b-xl border-t border-slate-800 flex items-start gap-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Example Rewrite</span>
            <p className="text-sm font-medium">"{result.example}"</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Paywall ────────────────────────────────────────────────────
function PremiumLock({ lockedCount, onUnlock }: { lockedCount: number; onUnlock: () => void }) {
  return (
    <div className="relative mt-8 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="p-8 opacity-10 pointer-events-none select-none blur-[2px]">
        <div className="h-40 bg-slate-100 rounded-lg border border-slate-200 mb-6" />
        <div className="h-40 bg-slate-100 rounded-lg border border-slate-200" />
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-md p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mb-4 shadow-sm">
          <Lock className="w-5 h-5 text-slate-600" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">{lockedCount} Additional Intelligence Modules</h3>
        <p className="text-slate-600 max-w-md mb-6 text-sm leading-relaxed">
          Access the complete enterprise UX analysis, including Value Proposition mapping, Trust Signal verification, and Friction audits.
        </p>
        <Button
          onClick={onUnlock}
          className="bg-slate-900 hover:bg-slate-800 text-white shadow-md font-medium px-8 h-11"
        >
          <Unlock className="w-4 h-4 mr-2" />
          Unlock Enterprise Report
        </Button>
      </div>
    </div>
  );
}

// ── Main Page Component ────────────────────────────────────────
function ResultsContent() {
  const params = useSearchParams();
  const auditId = params.get('id');
  const reportRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [audit, setAudit] = useState<any>(null);
  const [unlocked, setUnlocked] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!auditId) { setError('No audit ID.'); setLoading(false); return; }
    fetch(`/api/results?id=${auditId}`)
      .then(r => r.json())
      .then(d => { if (d.error) setError(d.error); else setAudit(d); })
      .catch(() => setError('Failed to load results.'))
      .finally(() => setLoading(false));
  }, [auditId]);

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const { toJpeg } = await import('html-to-image');
      const { jsPDF } = await import('jspdf');
      const el = reportRef.current;
      if (!el) return;
      const dataUrl = await toJpeg(el, { quality: 0.95, backgroundColor: '#ffffff', pixelRatio: 2 });
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [el.offsetWidth, el.offsetHeight] });
      pdf.addImage(dataUrl, 'JPEG', 0, 0, el.offsetWidth, el.offsetHeight);
      pdf.save(`Intelligence-Report-${audit?.url_domain || 'UXAuditX'}.pdf`);
    } catch (e) { console.error(e); }
    finally { setDownloading(false); }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin" />
        <span className="text-sm font-medium text-slate-600">Compiling Intelligence Report...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
      <AlertCircle className="w-8 h-8 text-red-500 mb-4" />
      <p className="text-slate-900 font-medium mb-4">{error}</p>
      <Link href="/">
        <Button variant="outline">Start New Audit</Button>
      </Link>
    </div>
  );

  const freeIssues: ParamResult[] = audit.free_results ?? [];
  const allIssues: ParamResult[] = audit.results ?? [];
  const displayIssues = unlocked ? allIssues : freeIssues;
  const lockedCount = 12 - freeIssues.length;
  const score = audit.overall_score ?? 0;

  const countSev = (sev: string) => (allIssues.length ? allIssues : freeIssues).filter(r => r.severity === sev).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-slate-200">
      
      {/* ── App Navigation (Hidden in Print) ── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 print:hidden shadow-sm">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="bg-white border-slate-200 text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <Download className="w-4 h-4 mr-2" />
              {downloading ? 'Exporting...' : 'Export as PDF'}
            </Button>
          </div>
        </div>
      </nav>

      {/* ── PDF Container ── */}
      <div ref={reportRef} className="bg-white">
        
        {/* ── Hero Header ── */}
        <header className="border-b border-slate-200 bg-white pt-16 pb-12">
          <div className="max-w-5xl mx-auto px-6">
            
            {/* Report Metadata */}
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-2">
                <MonitorCheck className="w-5 h-5 text-slate-900" />
                <span className="font-bold tracking-tight text-lg text-slate-900">UXAuditX</span>
                <Badge variant="secondary" className="ml-2 bg-slate-100 text-slate-600 hover:bg-slate-100 text-[10px] uppercase tracking-wider font-bold rounded-sm">Enterprise</Badge>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Generated</p>
                <p className="text-sm font-medium text-slate-700">
                  {new Date(audit.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Title & Core Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
                    UX Intelligence Report
                  </h1>
                  <div className="flex items-center gap-2 text-lg text-slate-600 font-medium">
                    <Globe className="w-5 h-5 text-slate-400" />
                    {audit.url_domain || audit.url}
                  </div>
                </div>
                
                <p className="text-slate-600 leading-relaxed text-lg max-w-xl">
                  {audit.summary || "Comprehensive analysis of conversion friction points, trust signals, and heuristic usability principles."}
                </p>
              </div>

              {/* Right: Mockup */}
              <div className="lg:col-span-5 h-64 w-full">
                <BrowserMockup url={audit.url_domain || audit.url} />
              </div>
            </div>

          </div>
        </header>

        {/* ── Executive Summary ── */}
        <div className="bg-slate-50 border-b border-slate-200 py-12">
          <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            {/* Health Score */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-center h-full">
               <HealthGauge score={score} />
            </div>

            {/* Severity Breakdown */}
            <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm h-full">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">Risk Distribution</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { k: 'critical', val: countSev('critical') },
                  { k: 'high',     val: countSev('high') },
                  { k: 'medium',   val: countSev('medium') },
                  { k: 'low',      val: countSev('low') },
                ].map(({ k, val }) => {
                  const cfg = SEV_CONFIG[k];
                  return (
                    <div key={k} className={`rounded-lg border p-3 ${cfg.bg} ${cfg.border}`}>
                      <div className="text-2xl font-bold text-slate-900 mb-1">{val}</div>
                      <div className={`text-xs font-semibold uppercase tracking-wider ${cfg.text}`}>{cfg.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* ── Detailed Findings ── */}
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Detailed Findings</h2>
              <p className="text-slate-500 text-sm">Actionable intelligence prioritized by business impact.</p>
            </div>
            {unlocked && (
               <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1.5 py-1">
                 <CheckCircle2 className="w-3.5 h-3.5" /> Complete Audit
               </Badge>
            )}
          </div>

          <div className="space-y-6">
            {displayIssues.map((res, i) => (
              <IssueReport key={res.id || i} result={res} index={i} />
            ))}
          </div>

          {!unlocked && lockedCount > 0 && (
            <PremiumLock lockedCount={lockedCount} onUnlock={() => setUnlocked(true)} />
          )}

        </div>

        {/* ── Print Footer (Hidden on screen, visible on PDF) ── */}
        <div className="hidden print:block fixed bottom-4 w-full text-center text-[10px] text-slate-400 font-medium uppercase tracking-widest border-t border-slate-200 pt-4 bg-white">
          Generated by UXAuditX Intelligence • {new Date().getFullYear()} • Confidential
        </div>

      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin" />
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
