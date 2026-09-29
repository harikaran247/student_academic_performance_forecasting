import React, { useState } from 'react';
import { 
  Target, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  TrendingDown, 
  HelpCircle,
  BookOpen,
  Clock,
  Award,
  ArrowRight,
  RefreshCw,
  Lightbulb
} from 'lucide-react';
import { postPrediction } from '../api';

export default function StudentPrediction({ onPredictionSuccess }) {
  const [formData, setFormData] = useState({
    Attendance_Percentage: 80.0,
    Internal_Marks: 72.0,
    Assignment_Score: 75.0,
    Previous_Semester_Score: 74.0,
    Study_Hours_Per_Day: 4.0,
    Engagement_Level: 'Medium'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await postPrediction(formData);
      setPredictionResult(res);
      if (onPredictionSuccess) onPredictionSuccess(res);
    } catch (err) {
      setError(err.message || 'Failed to submit prediction request');
    } finally {
      setLoading(false);
    }
  };

  const loadSampleScenario = async () => {
    const sample = {
      Attendance_Percentage: 62.0,
      Internal_Marks: 54.0,
      Assignment_Score: 58.0,
      Previous_Semester_Score: 72.0,
      Study_Hours_Per_Day: 1.5,
      Engagement_Level: 'Low'
    };
    setFormData(sample);
    setLoading(true);
    try {
      const res = await postPrediction(sample);
      setPredictionResult(res);
      if (onPredictionSuccess) onPredictionSuccess(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const bandStyles = {
    'At Risk': 'bg-red-100 text-red-800 border-red-200',
    'Average': 'bg-amber-100 text-amber-800 border-amber-200',
    'Good': 'bg-blue-100 text-blue-800 border-blue-200',
    'Excellent': 'bg-emerald-100 text-emerald-800 border-emerald-200'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Student Academic Performance Forecasting</h2>
          <p className="text-xs text-slate-500 mt-0.5">Enter student academic parameters to calculate predicted final score and risk band</p>
        </div>
        <button
          onClick={loadSampleScenario}
          className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-2 border border-slate-200 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          <span>Load At-Risk Sample Profile</span>
        </button>
      </div>

      {/* Main Grid: Form Left, Result Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Prediction Input Form */}
        <div className="lg:col-span-6 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2 pb-2 border-b border-slate-100">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>Academic Profile Inputs</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Section 1: Academic Scores */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider">📚 Academic Evaluation Scores</h4>
              
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Attendance Percentage (%)
                </label>
                <input
                  type="number"
                  name="Attendance_Percentage"
                  min="0"
                  max="100"
                  step="0.5"
                  value={formData.Attendance_Percentage}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
                <p className="text-[11px] text-slate-400 mt-0.5">Valid range: 0.0% to 100.0%</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Internal Test Marks (0-100)
                </label>
                <input
                  type="number"
                  name="Internal_Marks"
                  min="0"
                  max="100"
                  step="0.5"
                  value={formData.Internal_Marks}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
                <p className="text-[11px] text-slate-400 mt-0.5">Valid range: 0.0 to 100.0</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assignment Score (0-100)
                </label>
                <input
                  type="number"
                  name="Assignment_Score"
                  min="0"
                  max="100"
                  step="0.5"
                  value={formData.Assignment_Score}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
                <p className="text-[11px] text-slate-400 mt-0.5">Valid range: 0.0 to 100.0</p>
              </div>
            </div>

            {/* Section 2: Study Habits */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-wider">⏱️ Historical Score & Study Habits</h4>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Previous Semester Score (0-100)
                </label>
                <input
                  type="number"
                  name="Previous_Semester_Score"
                  min="0"
                  max="100"
                  step="0.5"
                  value={formData.Previous_Semester_Score}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
                <p className="text-[11px] text-slate-400 mt-0.5">Valid range: 0.0 to 100.0</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Study Hours Per Day
                </label>
                <input
                  type="number"
                  name="Study_Hours_Per_Day"
                  min="0"
                  max="16"
                  step="0.25"
                  value={formData.Study_Hours_Per_Day}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
                <p className="text-[11px] text-slate-400 mt-0.5">Valid range: 0.0 to 16.0 hours</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Classroom Engagement Level
                </label>
                <select
                  name="Engagement_Level"
                  value={formData.Engagement_Level}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-medium"
                >
                  <option value="High">High Engagement</option>
                  <option value="Medium">Medium Engagement</option>
                  <option value="Low">Low Engagement</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  <span>Processing Prediction Pipeline...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Forecast Academic Performance</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Prediction Output & Results Display */}
        <div className="lg:col-span-6 space-y-6">
          {predictionResult ? (
            <>
              {/* Score & Band Card */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-base font-bold text-slate-900">📊 Forecast Results Summary</h3>
                  <span className="text-xs font-semibold text-slate-400">Random Forest Regressor</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Score */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
                    <div className="text-xs font-bold text-slate-500 uppercase">Predicted Final Score</div>
                    <div className="text-3xl font-extrabold text-blue-900 mt-1">
                      {predictionResult.prediction.predicted_final_score.toFixed(2)}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Out of 100 marks</div>
                  </div>

                  {/* Band */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center flex flex-col items-center justify-center">
                    <div className="text-xs font-bold text-slate-500 uppercase mb-2">Performance Band</div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${bandStyles[predictionResult.prediction.performance_band] || 'bg-blue-100 text-blue-800'}`}>
                      {predictionResult.prediction.performance_band}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Score Trajectory */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="text-xs font-bold text-slate-500 uppercase">Score Trajectory</div>
                    <div className={`text-xl font-extrabold mt-1 flex items-center gap-1 ${
                      predictionResult.prediction.performance_change >= 0 ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {predictionResult.prediction.performance_change >= 0 ? (
                        <TrendingUp className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-600" />
                      )}
                      <span>{predictionResult.prediction.performance_change > 0 ? '+' : ''}{predictionResult.prediction.performance_change.toFixed(2)} pts</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">vs Prev Semester ({predictionResult.prediction.previous_semester_score})</div>
                  </div>

                  {/* Decline Warning */}
                  <div className={`p-4 rounded-xl border ${
                    predictionResult.prediction.is_academic_decline ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'
                  }`}>
                    <div className="text-xs font-bold uppercase ${predictionResult.prediction.is_academic_decline ? 'text-red-700' : 'text-emerald-700'}">
                      Decline Warning
                    </div>
                    <div className={`text-base font-extrabold mt-1 ${
                      predictionResult.prediction.is_academic_decline ? 'text-red-800' : 'text-emerald-800'
                    }`}>
                      {predictionResult.prediction.is_academic_decline ? `⚠️ ${predictionResult.prediction.decline_severity} Drop` : '✅ Positive Growth'}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      {predictionResult.prediction.is_academic_decline ? 'Intervention Recommended' : 'On Track'}
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 italic">
                  * Note: Score trajectory and decline warnings represent simple numerical comparisons relative to previous semester marks, not proof of future academic outcome.
                </p>
              </div>

              {/* Strengths & Action Plan Quick Cards */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span>Actionable Academic Support Plan</span>
                </h3>

                {predictionResult.recommendations.action_plan?.map((step, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-blue-50/70 border border-blue-100 text-xs text-blue-900 font-medium flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}

                <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-100">
                  {predictionResult.recommendations.disclaimer}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white p-8 rounded-xl border border-slate-200 text-center flex flex-col items-center justify-center h-full min-h-[380px]">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl mb-4 border border-blue-100">
                🎯
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Ready to Forecast Performance</h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Fill in the student academic evaluation parameters on the left and click <strong>Forecast Academic Performance</strong> to execute the Random Forest prediction pipeline.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
