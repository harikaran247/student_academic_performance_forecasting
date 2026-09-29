import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Overview from './components/Overview';
import DatasetEDA from './components/DatasetEDA';
import ModelEvaluation from './components/ModelEvaluation';
import StudentPrediction from './components/StudentPrediction';
import InsightsSupport from './components/InsightsSupport';

import { fetchOverview, fetchDataset, fetchEvaluation } from './api';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Data States
  const [overviewData, setOverviewData] = useState(null);
  const [datasetData, setDatasetData] = useState(null);
  const [evalData, setEvalData] = useState(null);
  const [lastPrediction, setLastPrediction] = useState(null);

  // Loading & Error States
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [loadingDataset, setLoadingDataset] = useState(false);
  const [loadingEval, setLoadingEval] = useState(false);

  const [errorOverview, setErrorOverview] = useState(null);
  const [errorDataset, setErrorDataset] = useState(null);
  const [errorEval, setErrorEval] = useState(null);

  // Load Overview Data on Mount
  useEffect(() => {
    fetchOverview()
      .then(data => {
        setOverviewData(data);
        setLoadingOverview(false);
      })
      .catch(err => {
        setErrorOverview(err.message);
        setLoadingOverview(false);
      });
  }, []);

  // Lazy Load Tab Data when switched
  useEffect(() => {
    if (activeTab === 'dataset' && !datasetData && !loadingDataset) {
      setLoadingDataset(true);
      fetchDataset()
        .then(data => {
          setDatasetData(data);
          setLoadingDataset(false);
        })
        .catch(err => {
          setErrorDataset(err.message);
          setLoadingDataset(false);
        });
    }

    if (activeTab === 'evaluation' && !evalData && !loadingEval) {
      setLoadingEval(true);
      fetchEvaluation()
        .then(data => {
          setEvalData(data);
          setLoadingEval(false);
        })
        .catch(err => {
          setErrorEval(err.message);
          setLoadingEval(false);
        });
    }
  }, [activeTab, datasetData, evalData, loadingDataset, loadingEval]);

  const titles = {
    overview: 'Overview Dashboard',
    dataset: 'Dataset & Visual Analytics',
    evaluation: 'Model Evaluation & Metrics',
    prediction: 'Student Performance Forecasting',
    insights: 'Academic Insights & Support'
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        <Header
          setIsOpen={setIsSidebarOpen}
          activeTabTitle={titles[activeTab] || 'Dashboard'}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'overview' && (
            <Overview
              data={overviewData}
              loading={loadingOverview}
              error={errorOverview}
            />
          )}

          {activeTab === 'dataset' && (
            <DatasetEDA
              data={datasetData}
              loading={loadingDataset}
              error={errorDataset}
            />
          )}

          {activeTab === 'evaluation' && (
            <ModelEvaluation
              data={evalData}
              loading={loadingEval}
              error={errorEval}
            />
          )}

          {activeTab === 'prediction' && (
            <StudentPrediction
              onPredictionSuccess={(res) => setLastPrediction(res)}
            />
          )}

          {activeTab === 'insights' && (
            <InsightsSupport
              data={lastPrediction}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="py-4 px-6 border-t border-slate-200 bg-white text-center text-xs text-slate-500">
          Student Academic Performance Forecasting • Smart India Hackathon 2026 Challenge 33 Solution
        </footer>
      </div>
    </div>
  );
}
