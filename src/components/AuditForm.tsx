'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight } from 'lucide-react';

export function AuditForm({ onSubmit, loading }: { onSubmit: (data: any) => void, loading: boolean }) {
  const [formData, setFormData] = useState({ url: '', name: '', email: '' });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="url" className="text-slate-300">Website URL</Label>
        <Input 
          id="url" type="url" placeholder="https://example.com" required 
          className="bg-slate-950 border-slate-800 text-white focus-visible:ring-purple-500 placeholder:text-slate-600 transition-all hover:border-slate-700"
          value={formData.url} onChange={(e) => setFormData({...formData, url: e.target.value})}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="name" className="text-slate-300">Your Name</Label>
        <Input 
          id="name" placeholder="Jane Doe" required 
          className="bg-slate-950 border-slate-800 text-white focus-visible:ring-purple-500 placeholder:text-slate-600 transition-all hover:border-slate-700"
          value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-slate-300">Work Email</Label>
        <Input 
          id="email" type="email" placeholder="jane@company.com" required 
          className="bg-slate-950 border-slate-800 text-white focus-visible:ring-purple-500 placeholder:text-slate-600 transition-all hover:border-slate-700"
          value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
      </div>
      <Button 
        type="submit" 
        disabled={loading}
        className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white border-0 shadow-lg shadow-purple-500/25 transition-all hover:shadow-purple-500/40 hover:-translate-y-0.5"
      >
        Analyze My Website <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </form>
  );
}
