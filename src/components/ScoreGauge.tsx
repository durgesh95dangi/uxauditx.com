import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

function getScoreColor(score: number) {
  if (score >= 70) return { bar: 'bg-green-500', text: 'text-green-400', label: 'Good' };
  if (score >= 45) return { bar: 'bg-yellow-500', text: 'text-yellow-400', label: 'Needs Work' };
  if (score >= 25) return { bar: 'bg-orange-500', text: 'text-orange-400', label: 'Poor' };
  return { bar: 'bg-red-500', text: 'text-red-400', label: 'Critical' };
}

export function ScoreGauge({ score }: { score: number }) {
  const cfg = getScoreColor(score);

  return (
    <div className="w-full space-y-3">
      <div className="flex justify-between items-end">
        <Tooltip>
          <TooltipTrigger>
            <span className={`text-5xl font-black tabular-nums ${cfg.text} cursor-default`}>
              {score}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Weighted score across 12 CRO parameters</p>
          </TooltipContent>
        </Tooltip>
        <div className="text-right">
          <p className="text-slate-500 text-xs">out of 100</p>
          <p className={`text-sm font-semibold ${cfg.text}`}>{cfg.label}</p>
        </div>
      </div>

      <Progress value={score} className="h-3 bg-slate-800" />

      <div className="flex justify-between text-xs text-slate-600">
        <span>0 — Critical</span>
        <span>50 — Average</span>
        <span>100 — Excellent</span>
      </div>
    </div>
  );
}
