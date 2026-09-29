/**
 * API Client for Student Academic Performance Forecasting REST Endpoints.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export async function fetchHealth() {
  const res = await fetch(`${API_BASE_URL}/api/health`);
  if (!res.ok) throw new Error("Backend server unavailable");
  return res.json();
}

export async function fetchOverview() {
  const res = await fetch(`${API_BASE_URL}/api/overview`);
  if (!res.ok) throw new Error("Failed to load overview analytics");
  return res.json();
}

export async function fetchDataset() {
  const res = await fetch(`${API_BASE_URL}/api/dataset`);
  if (!res.ok) throw new Error("Failed to load dataset details");
  return res.json();
}

export async function fetchEvaluation() {
  const res = await fetch(`${API_BASE_URL}/api/evaluation`);
  if (!res.ok) throw new Error("Failed to load model evaluation metrics");
  return res.json();
}

export async function postPrediction(studentData) {
  const res = await fetch(`${API_BASE_URL}/api/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(studentData)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Prediction request failed");
  }
  return res.json();
}
