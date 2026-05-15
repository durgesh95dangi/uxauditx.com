'use client';

import { Activity } from 'lucide-react';

export function ProgressSteps({ step }: { step: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-6">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-slate-800 rounded-full"></div>
        <div className="w-16 h-16 border-4 border-purple-500 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
        <Activity className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-purple-400 w-6 h-6 animate-pulse" />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-medium text-white mb-2">{step}</h3>
        <p className="text-sm text-slate-400">This usually takes about 10-15 seconds.</p>
      </div>
    </div>
  );
}
