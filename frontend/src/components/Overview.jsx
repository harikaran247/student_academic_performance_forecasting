import React from 'react';
import { 
  Users, 
  Layers, 
  Cpu, 
  TrendingUp, 
  Target, 
  Award,
  CheckCircle2,
  ArrowRight,
  GraduationCap
} from 'lucide-react';

export default function Overview({ data, loading, error }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700">
        <h3 className="font-bold text-lg mb-1">Backend Connection Error</h3>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  const kpis = [
    { title: 'Cleaned Records', value: data?.total_records?.toLocaleString() || '5,000', sub: 'Cleaned Dataset', icon: Users, color: 'from-blue-500 to-indigo-600' },
    { title: 'Input Features', value: `${data?.features_count || 6} Features`, sub: 'Academic & Behavioral', icon: Layers, color: 'from-indigo-500 to-purple-600' },
    { title: 'ML Algorithm', value: data?.model_algorithm || 'Random Forest', sub: 'Scikit-Learn Pipeline', icon: Cpu, color: 'from-teal-500 to-emerald-600' },
    { title: 'R² Score', value: data?.r2_score?.toFixed(4) || '0.6175', sub: 'Variance Explained', icon: TrendingUp, color: 'from-amber-500 to-orange-600' },
    { title: 'MAE Error', value: `${data?.mae?.toFixed(2) || '4.70'} pts`, sub: 'Average Score Error', icon: Target, color: 'from-rose-500 to-pink-600' },
    { title: 'Band Accuracy', value: `${data?.band_accuracy?.toFixed(1) || '69.5'}%`, sub: 'Classification Acc', icon: Award, color: 'from-cyan-500 to-blue-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-semibold mb-4">
            <GraduationCap className="w-4 h-4" />
            <span>SIH 2026 Challenge 33 Solution</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            Student Academic Performance Forecasting
          </h1>
          <p className="text-slate-300 text-base leading-relaxed">
            An end-to-end Machine Learning intelligence dashboard engineered to predict final academic scores, 
            categorize performance bands, flag academic decline, and deliver personalized intervention support.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${kpi.color} flex items-center justify-center text-white mb-3 shadow-xs`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{kpi.title}</div>
              <div className="text-xl font-extrabold text-slate-900 mt-0.5">{kpi.value}</div>
              <div className="text-[11px] text-slate-400 mt-1">{kpi.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Core Objectives & Workflow Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Objectives */}
        <div className="lg:col-span-7 bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
          <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            <span>Core Project Objectives</span>
          </h3>
          <p className="text-sm text-slate-500 mb-4">Functional scope aligned with SIH 2026 Challenge 33 requirements</p>

          <div className="space-y-3">
            {data?.project_objectives?.map((obj) => (
              <div key={obj.id} className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  {obj.id}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{obj.title}</h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{obj.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Workflow */}
        <div className="lg:col-span-5 bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-600" />
              <span>5-Step Machine Learning Workflow</span>
            </h3>
            <p className="text-sm text-slate-500 mb-4">Scikit-learn Random Forest Pipeline architecture</p>

            <div className="space-y-2.5">
              {data?.workflow?.map((step) => (
                <div key={step.step} className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {step.step}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-900">{step.name}</div>
                    <div className="text-[11px] text-slate-500 truncate">{step.detail}</div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Train/Test Split: <strong>80 / 20</strong></span>
            <span>Seed: <strong>42 (Reproducible)</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
