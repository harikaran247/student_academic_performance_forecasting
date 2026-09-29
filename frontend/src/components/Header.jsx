import React from 'react';
import { Menu, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Header({ setIsOpen, activeTabTitle }) {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setIsOpen(true)}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">{activeTabTitle}</h2>
          <p className="text-xs text-slate-500 hidden sm:block">Smart India Hackathon 2026 • Challenge 33 Solution</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Backend Connected (Port 8000)</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>SIH 2026 AI Prototype</span>
        </div>
      </div>
    </header>
  );
}
