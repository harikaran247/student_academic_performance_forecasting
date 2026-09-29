import React from 'react';
import { 
  BarChart3, 
  Database, 
  LineChart, 
  Target, 
  Lightbulb, 
  GraduationCap, 
  BrainCircuit, 
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen }) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3, badge: 'Summary' },
    { id: 'dataset', label: 'Dataset & EDA', icon: Database, badge: '5,000 Rows' },
    { id: 'evaluation', label: 'Model Evaluation', icon: LineChart, badge: 'R² 0.62' },
    { id: 'prediction', label: 'Student Prediction', icon: Target, badge: 'AI Form' },
    { id: 'insights', label: 'Insights & Support', icon: Lightbulb, badge: 'Action Plan' }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out
        lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-base text-white tracking-tight">SIH 2026 Challenge 33</h1>
              <p className="text-xs text-slate-400 font-medium">Student Performance AI</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Main Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-150 group
                  ${isActive 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 font-semibold' 
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                    isActive ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Model Engine Footer */}
        <div className="p-4 m-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
          <div className="flex items-center gap-2.5 text-blue-400 font-semibold text-xs mb-1">
            <BrainCircuit className="w-4 h-4" />
            <span>ML ENGINE STATUS</span>
          </div>
          <div className="text-sm font-bold text-white">Random Forest Regressor</div>
          <div className="text-xs text-slate-400 mt-0.5">Scikit-Learn Pipeline v1.0</div>
          <div className="mt-2.5 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
            <span>Status: <span className="text-emerald-400 font-semibold">Active</span></span>
            <span>R² 0.6175</span>
          </div>
        </div>
      </aside>
    </>
  );
}
