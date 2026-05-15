import { Button } from '@/components/ui/button';
import { Lock, Unlock, Zap } from 'lucide-react';

const LOCKED_PARAM_NAMES = [
  'Value Proposition', 'Trust Signals', 'Pricing Clarity',
  'Mobile UX', 'Form Friction', 'Copy Readability',
  'Visual Hierarchy', 'Page Speed Signals', 'SEO Basics',
];

interface PaywallBlockProps {
  lockedCount?: number;
  onUnlock: () => void;
}

export function PaywallBlock({ lockedCount = 9, onUnlock }: PaywallBlockProps) {
  const names = LOCKED_PARAM_NAMES.slice(0, lockedCount);

  return (
    <div className="relative mt-8 rounded-2xl border border-slate-800/50 bg-slate-900/20 overflow-hidden">
      {/* Blurred preview rows */}
      <div className="p-6 space-y-4 opacity-30 blur-sm pointer-events-none select-none">
        {names.map((name, i) => (
          <div key={i} className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="h-5 w-24 bg-slate-700 rounded" />
              <div className="h-5 w-16 bg-slate-700 rounded" />
            </div>
            <div className="text-sm text-slate-300 font-medium mb-2">{name}</div>
            <div className="space-y-2">
              <div className="h-3 bg-slate-800 rounded w-full" />
              <div className="h-3 bg-slate-800 rounded w-5/6" />
            </div>
          </div>
        ))}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/70 backdrop-blur-sm p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center mb-5">
          <Lock className="w-7 h-7 text-pink-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">
          {lockedCount} More Issues Found
        </h3>
        <p className="text-slate-300 max-w-md mx-auto mb-2">
          Our AI detected additional problems across Value Proposition, Trust Signals, Pricing Clarity, Mobile UX, and more.
        </p>
        <p className="text-slate-500 text-sm mb-8">Unlock all {lockedCount + 3} issues to fix what's silently killing your conversions.</p>

        <Button
          size="lg"
          onClick={onUnlock}
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white border-0 shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-all hover:-translate-y-0.5"
        >
          <Unlock className="w-4 h-4 mr-2" />
          Unlock Full Report
        </Button>
        <p className="text-slate-600 text-xs mt-3">Free during beta · Payment coming soon</p>
      </div>
    </div>
  );
}
