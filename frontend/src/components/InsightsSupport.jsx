import React from 'react';
import { Lightbulb, CheckCircle2, AlertTriangle, BookOpen, ShieldAlert, Sparkles } from 'lucide-react';

export default function InsightsSupport({ data }) {
  if (!data) {
    return (
      <div className="bg-white p-8 rounded-xl border border-slate-200 text-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl mx-auto mb-4 border border-amber-100">
          💡
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">No Active Student Profile Evaluated</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Please navigate to the <strong>Student Prediction</strong> tab to enter student parameters and submit a prediction request.
        </p>
      </div>
    );
  }

  const { prediction, recommendations, top_influencing_factors } = data;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Academic Insights & Support Recommendations</h2>
        <p className="text-xs text-slate-500 mt-0.5">Targeted interventions generated from student risk metrics and model parameters</p>
      </div>

      {/* Input Profile Summary Chips */}
      <div className="bg-white p-5 rounded-xl border border-slate-200">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Evaluated Student Parameter Chips</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Attendance</div>
            <div className="text-sm font-bold text-slate-900 mt-0.5">{prediction.input_features.Attendance_Percentage}%</div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Internal Marks</div>
            <div className="text-sm font-bold text-slate-900 mt-0.5">{prediction.input_features.Internal_Marks}</div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Assignment</div>
            <div className="text-sm font-bold text-slate-900 mt-0.5">{prediction.input_features.Assignment_Score}</div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Prev Semester</div>
            <div className="text-sm font-bold text-slate-900 mt-0.5">{prediction.input_features.Previous_Semester_Score}</div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Daily Study</div>
            <div className="text-sm font-bold text-slate-900 mt-0.5">{prediction.input_features.Study_Hours_Per_Day} hrs</div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Engagement</div>
            <div className="text-sm font-bold text-slate-900 mt-0.5">{prediction.input_features.Engagement_Level}</div>
          </div>
        </div>
      </div>

      {/* Row 1: Strengths & Vulnerabilities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Identified Academic Strengths</span>
          </h3>

          {recommendations.strengths?.length > 0 ? (
            <div className="space-y-2.5">
              {recommendations.strengths.map((item, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium flex items-start gap-2">
                  <span className="font-bold text-emerald-700">Positive:</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-500 italic">
              No specific strong performance indicators flagged in current inputs.
            </div>
          )}
        </div>

        {/* Vulnerabilities */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <span>Potential Vulnerabilities & Risk Factors</span>
          </h3>

          {recommendations.vulnerabilities?.length > 0 ? (
            <div className="space-y-2.5">
              {recommendations.vulnerabilities.map((item, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium flex items-start gap-2">
                  <span className="font-bold text-amber-700">Risk Factor:</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-700 font-medium">
              ✅ No major vulnerability indicators detected in current evaluation parameters.
            </div>
          )}
        </div>
      </div>

      {/* Row 2: Intervention Plan */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <span>Customized Support & Intervention Plan</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recommendations.action_plan?.map((step, idx) => (
            <div key={idx} className="p-3.5 rounded-lg bg-blue-50/70 border border-blue-100 text-xs text-blue-900 font-medium flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                {idx + 1}
              </div>
              <div className="pt-0.5">{step}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Methodological Disclaimer */}
      <div className="p-4 bg-slate-100 border border-slate-300 rounded-xl text-xs text-slate-600 space-y-1">
        <div className="font-bold text-slate-800 flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-slate-500" />
          <span>Official Disclaimer & Methodological Notice</span>
        </div>
        <p className="leading-relaxed">
          {recommendations.disclaimer || "Predictions are statistical estimates generated by a Random Forest regression model based on historical data associations. Feature importances and risk indicators reflect mathematical correlations in training data and do not constitute proof of causation. These estimates are designed to assist educators and counselors, not replace professional academic evaluation."}
        </p>
      </div>
    </div>
  );
}
