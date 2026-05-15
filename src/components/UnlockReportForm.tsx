'use client';

import { useState } from 'react';
import { ArrowRight, Lock, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function UnlockReportForm({ scanId }: { scanId: string }) {
  const [view, setView] = useState<'button' | 'form' | 'success'>('button');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mock API call for now — will be integrated in next phase
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setView('success');
  };

  if (view === 'success') {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 bg-[#0018F9]/10 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-[#0018F9]" />
        </div>
        <div className="text-center">
          <h4 className="text-xl font-bold text-slate-900 mb-1">Request Received</h4>
          <p className="text-slate-600 max-w-sm mx-auto">
            Thank you, {name}! We will send the full unlocked report to {email} shortly.
          </p>
        </div>
      </div>
    );
  }

  if (view === 'form') {
    return (
      <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="text-left space-y-3">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Your Name</label>
            <Input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="bg-white border-slate-300 text-slate-900 focus-visible:ring-[#0018F9]"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Work Email</label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@company.com"
              className="bg-white border-slate-300 text-slate-900 focus-visible:ring-[#0018F9]"
            />
          </div>
        </div>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full h-12 bg-[#0018F9] hover:bg-[#0018F9]/90 text-white font-medium text-base rounded-md shadow-md"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            'Send Me The Report'
          )}
        </Button>
      </form>
    );
  }

  return (
    <button 
      onClick={() => setView('form')}
      className="px-8 py-4 bg-[#0f172a] text-white rounded-md font-medium hover:bg-[#1e293b] transition-colors flex items-center shadow-lg mx-auto"
    >
      Get Full Report Free
      <ArrowRight className="w-4 h-4 ml-2" />
    </button>
  );
}
