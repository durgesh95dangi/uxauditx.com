'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MonitorCheck, Activity, Zap, BarChart3, Shield, ArrowRight, Sparkles, CheckCircle2, Loader2, Search, Eye } from 'lucide-react';

const STEPS = [
  'Understanding Business Context',
  'Competitor Benchmarking',
  'Persona Mapping',
  'SEO Keyword Analysis',
  'Performance Audit',
  'Final Report Generation',
];

export default function Home() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [viewState, setViewState] = useState<'form' | 'loading' | 'results'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [auditData, setAuditData] = useState<any>(null);
  const [error, setError] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  // Lead capture state
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadSubmitting, setLeadSubmitting] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    let interval: any;
    
    // Delay the full-screen loading transition by 1.2s to catch immediate errors 
    // like validation or rate limits without flashing the screen.
    const loadingTimeout = setTimeout(() => {
      setViewState('loading');
      setStepIdx(0);
      interval = setInterval(() => {
        setStepIdx(prev => Math.min(prev + 1, STEPS.length - 1));
      }, 8000);
    }, 1200);

    const urlParams = new URLSearchParams(window.location.search);

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          name: 'Anonymous',
          email: 'anonymous@uxauditx.com',
          utmParams: {
            utm_source: urlParams.get('utm_source'),
            utm_medium: urlParams.get('utm_medium'),
            utm_campaign: urlParams.get('utm_campaign'),
          },
        }),
      });

      const data = await response.json();
      
      clearTimeout(loadingTimeout);
      if (interval) clearInterval(interval);

      if (!response.ok) throw new Error(data.error || 'Something went wrong');

      setAuditData(data);
      // Immediately redirect to the full report page
      router.push(`/results?id=${data.auditId}`);
    } catch (err: any) {
      clearTimeout(loadingTimeout);
      if (interval) clearInterval(interval);
      setError(err.message);
      setViewState('form');
      setIsSubmitting(false);
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLeadSubmitting(true);
    // Mock API
    await new Promise(r => setTimeout(r, 1000));
    setLeadSubmitting(false);
    setShowLeadModal(false);
    if (auditData?.auditId) {
      router.push(`/results?id=${auditData.auditId}`);
    }
  };

  if (viewState !== 'form') {
    return (
      <main className="min-h-screen w-full flex flex-col bg-[#09090b] text-slate-50 font-sans overflow-hidden">
        {/* NEW HEADER FOR PROGRESS */}
        <div className="w-full px-8 py-6 border-b border-white/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0018F9] to-[#0018F9]/70 flex items-center justify-center">
              <MonitorCheck className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">UXAudit<span className="text-[#4D5FFF]">X</span></span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1 mt-6">Target Analysis</h1>
          <p className="text-slate-400">Real-time scan in progress for {url ? new URL(url).hostname : 'targetdomain.com'}</p>
        </div>

        {/* CONTENT PANELS CONTAINER */}
        <div className="flex-1 flex flex-col md:flex-row p-8 gap-6 max-w-[1600px] w-full mx-auto">
          
          {/* Left Pane - Live Scan Progress */}
          <div className="w-full md:w-[35%] bg-[#0f172a] rounded-xl border border-white/5 p-6 flex flex-col shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-8 flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-[#4D5FFF]" /> Live Scan Progress
            </h3>
            
            <div className="space-y-6">
              {STEPS.map((step, i) => {
                const isCompleted = i < stepIdx;
                const isActive = i === stepIdx;
                
                return (
                  <div key={i} className="flex flex-col relative">
                    <div className={`flex items-start gap-4 transition-all duration-300`}>
                      {isCompleted ? (
                        <>
                          <div className="flex-shrink-0 w-3 h-3 mt-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10B981]" />
                          <div>
                            <span className="text-sm font-bold text-white">{step}</span>
                            <div className="text-xs text-emerald-400 mt-1 font-mono">Completed (0.{i+2}s)</div>
                          </div>
                        </>
                      ) : isActive ? (
                        <>
                          <div className="flex-shrink-0 w-3 h-3 mt-1.5 rounded-full bg-[#4D5FFF] shadow-[0_0_10px_#4D5FFF]" />
                          <div className="w-full">
                            <span className="text-sm font-bold text-white">{step}</span>
                            <div className="mt-3 bg-[#09090b] rounded-md p-3 border border-white/5 relative overflow-hidden">
                               <div className="flex items-center gap-2 text-xs text-slate-300 mb-3 font-mono">
                                 <Search className="w-3 h-3 text-[#4D5FFF]" /> Analyzing demographic clusters...
                               </div>
                               <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                                 <div className="h-full bg-gradient-to-r from-[#0018F9] to-[#4D5FFF] animate-[pulse_2s_ease-in-out_infinite]" style={{ width: '60%' }} />
                               </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex-shrink-0 w-3 h-3 mt-1.5 rounded-full bg-slate-700" />
                          <div>
                            <span className="text-sm font-medium text-slate-500">{step}</span>
                            <div className="text-xs text-slate-600 mt-1 font-mono">Pending</div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Pane - Animation or Results */}
          <div className="w-full md:w-[65%] bg-[#0f172a] rounded-xl border border-white/5 overflow-hidden flex flex-col relative shadow-xl min-h-[600px]">
            {viewState === 'loading' ? (
              <>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0f172a]/50">
                  <div className="flex items-center gap-3 text-white font-semibold">
                    <Eye className="w-5 h-5 text-[#4D5FFF]" /> Analysis in Progress
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                </div>
                
                {/* Content Area */}
                <div className="relative flex-1 bg-[#09090b] overflow-hidden">
                  <img 
                    src={url ? `https://image.thum.io/get/width/1200/crop/800/${url}` : '/cyber_brain_bg.png'} 
                    alt="Target Screenshot" 
                    className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity border border-white/5 rounded-lg transform scale-105" 
                    onError={(e) => { e.currentTarget.src = '/cyber_brain_bg.png' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-[#09090b]/80" />
                  <div className="absolute inset-0 bg-[#0018F9]/10 mix-blend-overlay" />
                  
                  {/* Floating Cards */}
                  <div className="absolute top-12 left-8 bg-[#09090b]/80 backdrop-blur-md border border-[#4D5FFF]/30 rounded-lg p-5 min-w-[220px] animate-[pulse_4s_ease-in-out_infinite]">
                    <div className="text-[10px] font-mono text-[#4D5FFF] mb-4 tracking-widest font-bold">DOM STRUCTURE</div>
                    <div className="space-y-3 text-xs font-mono">
                      <div className="flex justify-between text-slate-300"><span>Divs</span> <span className="text-white">342</span></div>
                      <div className="flex justify-between text-slate-300"><span>Images</span> <span className="text-white">12</span></div>
                      <div className="flex justify-between text-slate-300"><span>Scripts</span> <span className="text-emerald-400">4</span></div>
                    </div>
                  </div>

                  <div className="absolute bottom-12 right-8 bg-[#09090b]/90 backdrop-blur-md border border-emerald-500/30 rounded-lg p-5 min-w-[280px] animate-[pulse_5s_ease-in-out_infinite]" style={{ animationDelay: '1s' }}>
                    <div className="text-[10px] font-mono text-emerald-400 mb-3 tracking-widest font-bold">METADATA EXTRACT</div>
                    <div className="text-[11px] font-mono text-slate-300 mb-4 bg-black/50 p-3 rounded border border-white/10 break-all">
                      &lt;meta name="description" content="Optimize ..." /&gt;
                    </div>
                    <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono font-bold">
                      <CheckCircle2 className="w-4 h-4" /> Validated
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-8 overflow-y-auto w-full h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-semibold mb-6 w-fit border border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4" />
                  Analysis Complete
                </div>
                <h2 className="text-3xl font-bold text-white mb-3">We found {auditData?.totalIssues} conversion blockers</h2>
                <p className="text-slate-400 mb-10 text-base">Here are the top 3 critical issues we identified immediately. You are losing leads due to these friction points.</p>
                
                <div className="space-y-5">
                  {auditData?.freeIssues?.map((issue: any, idx: number) => (
                    <div key={idx} className="bg-[#09090b] border border-white/5 rounded-xl p-6 relative overflow-hidden group hover:border-white/10 transition-colors">
                      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#0018F9] to-transparent" />
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">
                          {issue.severity || 'High'} Impact
                        </span>
                        <h4 className="text-lg font-bold text-white">{issue.name || issue.parameter_name}</h4>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <div className="text-[10px] text-slate-500 font-bold mb-1.5 uppercase tracking-wider">Observed Problem</div>
                          <p className="text-slate-300 text-sm leading-relaxed">{issue.problem || issue.issue_description}</p>
                        </div>
                        <div>
                          <div className="text-[10px] text-[#4D5FFF] font-bold mb-1.5 uppercase tracking-wider">Recommended Fix</div>
                          <p className="text-slate-300 text-sm leading-relaxed">{issue.fix || issue.recommendation}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12 text-center pb-6">
                  <div className="relative inline-block w-full max-w-sm mx-auto">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#0018F9] to-[#4D5FFF] rounded-full blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                    <Button 
                      onClick={() => setShowLeadModal(true)}
                      className="relative w-full h-14 px-8 rounded-full bg-gradient-to-r from-[#0018F9] to-[#0018F9]/80 hover:from-[#0018F9]/90 hover:to-[#0018F9]/70 text-white border border-white/10 shadow-[0_0_30px_rgba(0,24,249,0.3)] transition-all font-bold text-lg"
                    >
                      Get Full Report (Free) <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                  <p className="text-sm text-slate-500 mt-5 font-medium">Unlock all {auditData?.totalIssues} issues and a full action plan.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Lead Capture Modal */}
        {showLeadModal && (
          <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-8 md:p-10 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-300">
              <button 
                onClick={() => setShowLeadModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
              
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0018F9] to-[#0018F9]/70 flex items-center justify-center mb-6 shadow-lg shadow-[#0018F9]/20 border border-white/10">
                <MonitorCheck className="w-7 h-7 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">Where should we send it?</h3>
              <p className="text-slate-400 mb-8 text-sm leading-relaxed">Enter your details to receive the full {auditData?.totalIssues}-point audit report immediately.</p>
              
              <form onSubmit={handleLeadSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Your Name</label>
                  <Input 
                    required 
                    value={leadName} 
                    onChange={e => setLeadName(e.target.value)} 
                    placeholder="John Doe"
                    className="bg-[#09090b] border-white/10 text-white h-12 focus-visible:ring-[#0018F9]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Work Email</label>
                  <Input 
                    required 
                    type="email"
                    value={leadEmail} 
                    onChange={e => setLeadEmail(e.target.value)} 
                    placeholder="john@company.com"
                    className="bg-[#09090b] border-white/10 text-white h-12 focus-visible:ring-[#0018F9]"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={leadSubmitting}
                  className="w-full h-14 bg-[#0018F9] hover:bg-[#0018F9]/90 text-white font-bold text-base mt-2 shadow-lg shadow-[#0018F9]/25 transition-all"
                >
                  {leadSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Get Report'}
                </Button>
                <p className="text-sm text-center text-slate-500 mt-4">We will send report on above mail</p>
              </form>
            </div>
          </div>
        )}

      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#09090b] text-slate-50 flex flex-col relative overflow-hidden font-sans">
      
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 md:px-12 transition-all duration-300 ${isScrolled ? 'backdrop-blur-md bg-[#09090b]/80 border-b border-white/10 shadow-lg' : 'bg-transparent border-transparent'}`}>
        <div className="flex items-center gap-3">
          {/* Logo icon — blue gradient */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0018F9] to-[#0018F9]/70 flex items-center justify-center shadow-lg shadow-[#0018F9]/25 border border-white/10">
            <MonitorCheck className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">UXAudit<span className="bg-gradient-to-r from-[#0018F9] to-[#4D5FFF] bg-clip-text text-transparent">X</span></span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#" className="hover:text-white transition-colors">How it works</a>
          <a href="#" className="hover:text-white transition-colors">Features</a>
          <a href="#" className="hover:text-white transition-colors">Wall of Love</a>
        </nav>
        
        <div className="flex items-center gap-5">
          <a href="#" className="text-sm font-medium text-slate-300 hover:text-white transition-colors hidden sm:block">Log in</a>
          <Button className="h-10 px-5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all text-sm font-medium shadow-sm hover:shadow-white/5">
            Book a Demo
          </Button>
        </div>
      </header>

      {/* Background with Grid and Glow */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Rectangle Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_100%_100%_at_50%_0%,#000_40%,transparent_100%)]" />
        
        {/* Ambient glow — blue */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#0018F9]/15 rounded-full blur-[120px]" />
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-[#0018F9]/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/4 -right-20 w-[500px] h-[500px] bg-[#0018F9]/10 rounded-full blur-[120px]" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-8 relative z-10">

        {/* Badge — blue */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#0018F9]/30 bg-[#0018F9]/10 text-[#4D5FFF] text-xs font-semibold mb-6 backdrop-blur-sm shadow-[0_0_15px_rgba(0,24,249,0.15)]">
          <Sparkles className="w-3.5 h-3.5" />
          AI-Powered CRO Audit · Free
        </div>

        {/* Headline — blue gradient on "losing money" */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-center max-w-4xl leading-[1.1] mb-4 drop-shadow-sm">
          <span className="text-white">Your website is </span>
          <span className="bg-gradient-to-r from-[#0018F9] to-[#4D5FFF] bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(0,24,249,0.3)]">
            losing money
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-400 text-base text-center max-w-2xl leading-relaxed mb-8">
          Paste your URL and get a brutally honest 12-point CRO audit in under 60 seconds.
        </p>

        {/* Form area */}
        <div className="w-full max-w-xl">
            <form onSubmit={handleSubmit} className="space-y-4 relative group">
              <div className="relative flex bg-[#09090b]/80 backdrop-blur-md rounded-full p-2 border border-white/15 shadow-[0_0_30px_rgba(0,24,249,0.1)] transition-all hover:border-white/25 focus-within:border-[#0018F9]/50 focus-within:shadow-[0_0_40px_rgba(0,24,249,0.2)]">
                <Input
                  id="url"
                  type="url"
                  placeholder="https://yourwebsite.com"
                  required
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  className="flex-1 h-14 bg-transparent hover:bg-transparent focus:bg-transparent focus-within:bg-transparent active:bg-transparent border-0 text-white placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0 px-6 text-base [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_px_1000px_#09090b_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:white]"
                />
                {/* CTA Button — blue gradient */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-14 px-8 rounded-full bg-gradient-to-r from-[#0018F9] to-[#0018F9]/80 hover:from-[#0018F9]/90 hover:to-[#0018F9]/70 text-white border-0 shadow-lg shadow-[#0018F9]/25 hover:shadow-[#0018F9]/40 transition-all font-bold text-base whitespace-nowrap overflow-hidden group/btn relative disabled:opacity-70"
                >
                  <div className="absolute inset-0 bg-white/15 translate-y-full group-hover/btn:translate-y-0 transition-transform rounded-full" />
                  <span className="relative z-10 flex items-center">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Checking...
                      </>
                    ) : (
                      <>
                        Audit Now <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                </Button>
              </div>
              
              {error && (
                <div className="absolute -bottom-10 left-0 right-0 text-center">
                  <p className="text-red-400 text-sm font-medium bg-red-500/10 inline-block px-4 py-1.5 rounded-full border border-red-500/20 backdrop-blur-md shadow-lg shadow-red-500/10">{error}</p>
                </div>
              )}
              
              <p className="text-slate-500 text-sm text-center pt-5 font-medium flex items-center justify-center gap-2">
                <Shield className="w-4 h-4 text-slate-600" />
                Free · No account needed · Results in ~60s
              </p>
            </form>
        </div>

        {/* Features row — blue icons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 max-w-3xl w-full">
          {[
            { icon: Zap, title: 'Vision AI Analysis' },
            { icon: BarChart3, title: '12 CRO Parameters' },
            { icon: Shield, title: 'Actionable Fixes' },
          ].map(({ icon: Icon, title }, i) => (
            <div key={i} className="flex items-center gap-2 text-slate-300 bg-white/5 px-4 py-2 rounded-full border border-white/10 shadow-sm backdrop-blur-sm">
              <Icon className="w-4 h-4 text-[#4D5FFF]" />
              <span className="text-sm font-medium">{title}</span>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
