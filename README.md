# 🎓 Student Academic Performance Forecasting (SIH 2026 Challenge 33)

An end-to-end Machine Learning system built for **Smart India Hackathon 2026 Challenge 33**. The system predicts a student's final academic score, assigns performance bands, detects academic decline, and delivers actionable academic support recommendations via an interactive web dashboard.

---

## 📌 Project Architecture & Directory Layout

```
ML_student_score/
├── data/
│   └── student_performance_challenge33.csv (1).xls   # Original intact raw dataset
├── models/
│   ├── rf_model.joblib                               # Trained Scikit-Learn Pipeline
│   └── model_meta.json                               # Feature & threshold metadata
├── reports/
│   ├── metrics.json                                  # MAE, RMSE, R2, and accuracy metrics
│   └── charts/                                       # Generated publication-ready EDA charts
│       ├── score_distribution.png
│       ├── correlation_heatmap.png
│       ├── performance_band_count.png
│       ├── engagement_vs_score.png
│       ├── feature_vs_target.png
│       ├── actual_vs_predicted.png
│       ├── residual_plot.png
│       └── feature_importance.png
├── src/
│   ├── __init__.py                                   # Package initialization & OS DLL workaround
│   ├── data_loader.py                                # Dynamic dataset loader & inspector
│   ├── preprocessing.py                              # Sanitization, deduplication, & Pipeline builder
│   ├── eda.py                                        # Automated chart generation engine
│   ├── model_utils.py                                # Robust Random Forest Regressor engine
│   ├── train.py                                      # Pipeline training & Joblib persistence
│   ├── evaluate.py                                   # Evaluation metrics & diagnostic plotting
│   └── predict.py                                    # Inference engine, band assignment, & support plans
├── tests/
│   └── test_pipeline.py                              # Unit and integration test suite
├── app.py                                            # Streamlit Web Application Dashboard
├── requirements.txt                                  # Dependency requirements
└── README.md                                         # Project documentation
```

---

## 🔍 Dataset Findings & Data Quality Report

- **Dimensions**: 5,010 rows, 10 columns (5,000 unique student records + 10 duplicate rows appended at the end).
- **Columns & Data Types**:
  - `Student_ID`: Identifier (Excluded from model training)
  - `Attendance_Percentage` (float64): Attendance rate (0 - 100%)
  - `Internal_Marks` (float64): Internal assessment score (0 - 100)
  - `Assignment_Score` (float64): Assignment evaluation score (0 - 100)
  - `Previous_Semester_Score` (float64): Historical semester score (0 - 100)
  - `Study_Hours_Per_Day` (float64): Daily study duration (0 - 24 hours)
  - `Engagement_Level` (categorical): 'Low', 'Medium', 'High'
  - `Final_Academic_Score` (float64): **Target Variable** (0 - 100)
  - `Performance_Band` (categorical): Target-derived category ('At Risk', 'Average', 'Good', 'Excellent')
  - `Performance_Change` (float64): `Final_Academic_Score - Previous_Semester_Score`
- **Data Quality Issues Resolved**:
  - **Duplicates**: Deduplicated 10 duplicate `Student_ID` rows (rows 5000-5009).
  - **Out-of-Bound Values**: Sanitized out-of-range attendance (-5.0, 105.0) and internal marks (150.0) to NaN for median imputation.
  - **Data Leakage Prevention**: `Performance_Band` and `Performance_Change` were **strictly excluded** from input features as they are directly derived from the target `Final_Academic_Score`.

---

## ⚙️ Model Pipeline & Verification Metrics

- **ML Engine**: Scikit-Learn Pipeline combining `ColumnTransformer` (Median Imputer, StandardScaler, OneHotEncoder) with `RandomForestRegressor` (100 estimators).
- **Split**: 80% Training (4,000 samples), 20% Held-Out Testing (1,000 samples), `random_state=42`.

### Held-Out Test Metrics

| Metric | Value |
| :--- | :--- |
| **Mean Absolute Error (MAE)** | `4.6984` marks |
| **Root Mean Squared Error (RMSE)** | `5.8346` marks |
| **R² Score** | `0.6175` |
| **Performance Band Accuracy** | `69.50%` |

---

## ⚡ Quick Start Guide

### 1. Environment Setup

```bash
# Navigate to project directory
cd c:\Users\Welcome\Documents\projects\ML_student_score

# Create and activate virtual environment
python -m venv .venv
.venv\Scripts\activate

# Install requirements
pip install -r requirements.txt
```

### 2. Run Data Preprocessing & Model Training

```bash
python src/train.py
```

### 3. Run Model Evaluation & Diagnostic Visualizations

```bash
python src/evaluate.py
```

### 4. Run Automated Test Suite

```bash
python tests/test_pipeline.py
```

### 5. Launch Streamlit Web Dashboard

```bash
streamlit run app.py
```

---

## 🎯 Official Performance Band Thresholds

| Performance Band | Score Range | Description |
| :--- | :--- | :--- |
| **At Risk** | `< 55.0` | Requires urgent academic support & intervention |
| **Average** | `55.0 - 69.9` | Moderate performance; scope for improvement |
| **Good** | `70.0 - 84.9` | Strong academic standing |
| **Excellent** | `>= 85.0` | Outstanding academic achievement |

---

## ⚠️ Disclaimer

All score forecasts and performance bands generated by this system are statistical estimates derived from historical patterns. They serve as early-warning indicators for educators and students, not guaranteed academic outcomes.
