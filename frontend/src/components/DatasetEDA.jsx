import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  ScatterChart,
  Scatter
} from 'recharts';
import { Database, Table, AlertTriangle, FileText, CheckCircle } from 'lucide-react';

export default function DatasetEDA({ data, loading, error }) {
  const [activeSubTab, setActiveSubTab] = useState('charts');

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
        <h3 className="font-bold text-lg mb-1">Failed to load dataset details</h3>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  const bandColors = {
    'At Risk': '#ef4444',
    'Average': '#f59e0b',
    'Good': '#3b82f6',
    'Excellent': '#10b981'
  };

  return (
    <div className="space-y-6">
      {/* Header & Sub-Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Dataset & Visual Exploratory Analytics</h2>
          <p className="text-xs text-slate-500 mt-0.5">Statistical distributions and data quality audit for SIH Challenge 33</p>
        </div>

        <div className="flex items-center p-1 bg-slate-100 rounded-lg shrink-0">
          <button
            onClick={() => setActiveSubTab('charts')}
            className={`px-4 py-2 rounded-md text-xs font-semibold transition-all ${
              activeSubTab === 'charts' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📊 Visual Charts
          </button>
          <button
            onClick={() => setActiveSubTab('audit')}
            className={`px-4 py-2 rounded-md text-xs font-semibold transition-all ${
              activeSubTab === 'audit' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📄 Data Audit & Schema
          </button>
        </div>
      </div>

      {activeSubTab === 'charts' ? (
        <div className="space-y-6">
          {/* Row 1: Distribution & Band Counts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Score Distribution */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-1">1. Final Academic Score Distribution</h3>
              <p className="text-xs text-slate-500 mb-4">Histogram bins of Final_Academic_Score (Mean ~ 75.15)</p>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.score_distribution || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="bin" tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff' }}
                      formatter={(val) => [`${val} Students`, 'Count']}
                    />
                    <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Performance Band Distribution */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-1">2. Student Performance Band Counts</h3>
              <p className="text-xs text-slate-500 mb-4">At Risk (&lt;55), Average (55-70), Good (70-85), Excellent (&ge;85)</p>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.performance_bands || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="band" tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff' }}
                      formatter={(val) => [`${val} Students`, 'Count']}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {data?.performance_bands?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={bandColors[entry.band] || '#3b82f6'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Row 2: Engagement Level & Scatter Sample */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Engagement vs Score */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-1">3. Classroom Engagement vs Final Score</h3>
              <p className="text-xs text-slate-500 mb-4">Average academic marks across Low, Medium, High engagement levels</p>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.engagement_analysis || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="level" tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff' }}
                    />
                    <Bar dataKey="mean_score" name="Avg Final Score" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Scatter Sample: Internal Marks vs Final Score */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-1">4. Internal Marks vs Final Academic Score</h3>
              <p className="text-xs text-slate-500 mb-4">Sample scatter plot showing linear correlation (r = 0.58)</p>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis type="number" dataKey="Internal_Marks" name="Internal Marks" domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis type="number" dataKey="Final_Academic_Score" name="Final Score" domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Tooltip 
                      cursor={{ strokeDasharray: '3 3' }}
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff' }}
                    />
                    <Scatter name="Students" data={data?.scatter_sample || []} fill="#06b6d4" fillOpacity={0.7} />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Data Audit & Schema Sub-Tab */
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="text-xs font-bold text-blue-700 uppercase">Raw Records</div>
              <div className="text-2xl font-extrabold text-blue-900 mt-1">{data?.raw_count?.toLocaleString()}</div>
              <div className="text-xs text-blue-600 mt-1">student_performance_challenge33.csv (1).xls</div>
            </div>
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <div className="text-xs font-bold text-emerald-700 uppercase">Cleaned Records</div>
              <div className="text-2xl font-extrabold text-emerald-900 mt-1">{data?.cleaned_count?.toLocaleString()}</div>
              <div className="text-xs text-emerald-600 mt-1">10 duplicate student rows removed</div>
            </div>
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
              <div className="text-xs font-bold text-purple-700 uppercase">Sanitization</div>
              <div className="text-2xl font-extrabold text-purple-900 mt-1">3 Out-of-Bounds</div>
              <div className="text-xs text-purple-600 mt-1">Attendance &lt;0/&gt;100 & Internal &gt;100 replaced with NaN</div>
            </div>
          </div>

          {/* Sample Table */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Table className="w-4 h-4 text-blue-600" />
              <span>Sample Cleaned Data Records (First 15 Rows)</span>
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                    <th className="p-2.5">Student ID</th>
                    <th className="p-2.5">Attendance</th>
                    <th className="p-2.5">Internal</th>
                    <th className="p-2.5">Assignment</th>
                    <th className="p-2.5">Prev Sem</th>
                    <th className="p-2.5">Study Hrs</th>
                    <th className="p-2.5">Engagement</th>
                    <th className="p-2.5">Final Score</th>
                    <th className="p-2.5">Band</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data?.sample_records?.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-2.5 font-mono text-slate-900 font-semibold">{row.Student_ID}</td>
                      <td className="p-2.5">{row.Attendance_Percentage}%</td>
                      <td className="p-2.5">{row.Internal_Marks}</td>
                      <td className="p-2.5">{row.Assignment_Score}</td>
                      <td className="p-2.5">{row.Previous_Semester_Score}</td>
                      <td className="p-2.5">{row.Study_Hours_Per_Day} hrs</td>
                      <td className="p-2.5 font-medium">{row.Engagement_Level}</td>
                      <td className="p-2.5 font-bold text-blue-700">{row.Final_Academic_Score}</td>
                      <td className="p-2.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          row.Performance_Band === 'At Risk' ? 'bg-red-100 text-red-700' :
                          row.Performance_Band === 'Average' ? 'bg-amber-100 text-amber-700' :
                          row.Performance_Band === 'Good' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {row.Performance_Band}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
