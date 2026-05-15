import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Lightbulb, TrendingDown } from 'lucide-react';
import type { ParamResult } from '@/types';

const severityConfig = {
  critical: { badge: 'bg-red-600/20 text-red-400 border-red-600/30', icon: '🔴', label: 'Critical' },
  high:     { badge: 'bg-orange-500/15 text-orange-400 border-orange-500/25', icon: '🟠', label: 'High' },
  medium:   { badge: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/25', icon: '🟡', label: 'Medium' },
  low:      { badge: 'bg-green-500/15 text-green-400 border-green-500/25', icon: '🟢', label: 'Low' },
};

export function IssueCard({ result }: { result: ParamResult }) {
  const cfg = severityConfig[result.severity] ?? severityConfig.medium;

  return (
    <Card className="bg-slate-900/60 border-slate-800 shadow-xl hover:border-slate-700 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={cfg.badge}>
              {cfg.icon} {cfg.label}
            </Badge>
            <Badge variant="outline" className="border-slate-700 text-slate-400 bg-slate-800/50 text-xs">
              {result.score}/10
            </Badge>
          </div>
          <span className="text-xs text-slate-500 capitalize">{result.category}</span>
        </div>
        <CardTitle className="text-lg text-white leading-snug mt-2">{result.name}</CardTitle>
        {result.title && (
          <p className="text-sm text-slate-400 italic">"{result.title}"</p>
        )}
      </CardHeader>

      <Separator className="bg-slate-800 mx-6 mb-4" style={{ width: 'calc(100% - 3rem)' }} />

      <CardContent className="space-y-4">
        {/* Problem */}
        <Alert className="bg-red-500/5 border-red-500/20 text-slate-300">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          <AlertTitle className="text-red-400 text-xs font-semibold uppercase tracking-wider mb-1">Problem</AlertTitle>
          <AlertDescription className="text-slate-300 text-sm leading-relaxed">
            {result.problem}
          </AlertDescription>
        </Alert>

        {/* Fix */}
        <Alert className="bg-purple-500/5 border-purple-500/20">
          <Lightbulb className="h-4 w-4 text-purple-400" />
          <AlertTitle className="text-purple-400 text-xs font-semibold uppercase tracking-wider mb-1">Fix</AlertTitle>
          <AlertDescription className="text-slate-300 text-sm leading-relaxed">
            {result.fix}
          </AlertDescription>
        </Alert>

        {/* Example */}
        {result.example && result.example !== 'N/A' && (
          <div className="px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-semibold">Example</p>
            <p className="text-sm text-slate-300 italic">{result.example}</p>
          </div>
        )}

        {/* Impact */}
        {result.impact && (
          <div className="flex items-start gap-2 text-xs text-slate-500">
            <TrendingDown className="w-3 h-3 mt-0.5 text-red-500/70 shrink-0" />
            <span>{result.impact}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
