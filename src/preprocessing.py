"""
Data Preprocessing Module for Student Academic Performance Forecasting.
Handles data cleaning, sanitization, feature splitting, and Scikit-learn Preprocessing Pipelines.
"""

import sys
import types

# Compatibility layer for OS environments with strict C-extension DLL policies
if "sklearn.decomposition._cdnmf_fast" not in sys.modules:
    dummy_cdnmf = types.ModuleType("sklearn.decomposition._cdnmf_fast")
    dummy_cdnmf._update_cdnmf_fast = lambda *args, **kwargs: None
    sys.modules["sklearn.decomposition._cdnmf_fast"] = dummy_cdnmf

import pandas as pd
import numpy as np
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder, StandardScaler

# Verified feature definitions
FEATURE_COLUMNS = [
    "Attendance_Percentage",
    "Internal_Marks",
    "Assignment_Score",
    "Previous_Semester_Score",
    "Study_Hours_Per_Day",
    "Engagement_Level"
]

NUMERICAL_FEATURES = [
    "Attendance_Percentage",
    "Internal_Marks",
    "Assignment_Score",
    "Previous_Semester_Score",
    "Study_Hours_Per_Day"
]

CATEGORICAL_FEATURES = [
    "Engagement_Level"
]

TARGET_COLUMN = "Final_Academic_Score"

# Official / Dataset Verified Performance Band Cutoffs on Final_Academic_Score
# At Risk: < 55 | Average: 55-70 | Good: 70-85 | Excellent: >= 85
BAND_THRESHOLDS = {
    "At Risk": (0.0, 55.0),
    "Average": (55.0, 70.0),
    "Good": (70.0, 85.0),
    "Excellent": (85.0, 100.0)
}

def clean_raw_data(df: pd.DataFrame) -> pd.DataFrame:
    """
    Cleans raw dataset:
    1. Removes exact and Student_ID duplicates (keeping the first original record).
    2. Flags/sanitizes out-of-bound invalid numeric values so imputation can process them cleanly.
    """
    cleaned_df = df.copy()
    
    # 1. Deduplicate by Student_ID (keep first instance)
    if "Student_ID" in cleaned_df.columns:
        cleaned_df = cleaned_df.drop_duplicates(subset=["Student_ID"], keep="first").reset_index(drop=True)
    else:
        cleaned_df = cleaned_df.drop_duplicates().reset_index(drop=True)
        
    # 2. Sanitize out-of-bound numerical values to NaN for pipeline imputation
    if "Attendance_Percentage" in cleaned_df.columns:
        mask = (cleaned_df["Attendance_Percentage"] < 0) | (cleaned_df["Attendance_Percentage"] > 100)
        cleaned_df.loc[mask, "Attendance_Percentage"] = np.nan
        
    if "Internal_Marks" in cleaned_df.columns:
        mask = (cleaned_df["Internal_Marks"] < 0) | (cleaned_df["Internal_Marks"] > 100)
        cleaned_df.loc[mask, "Internal_Marks"] = np.nan
        
    if "Assignment_Score" in cleaned_df.columns:
        mask = (cleaned_df["Assignment_Score"] < 0) | (cleaned_df["Assignment_Score"] > 100)
        cleaned_df.loc[mask, "Assignment_Score"] = np.nan
        
    if "Previous_Semester_Score" in cleaned_df.columns:
        mask = (cleaned_df["Previous_Semester_Score"] < 0) | (cleaned_df["Previous_Semester_Score"] > 100)
        cleaned_df.loc[mask, "Previous_Semester_Score"] = np.nan
        
    if "Study_Hours_Per_Day" in cleaned_df.columns:
        mask = (cleaned_df["Study_Hours_Per_Day"] < 0) | (cleaned_df["Study_Hours_Per_Day"] > 24)
        cleaned_df.loc[mask, "Study_Hours_Per_Day"] = np.nan
        
    return cleaned_df

def get_feature_target_split(df: pd.DataFrame):
    """
    Splits DataFrame into features X and target y.
    Strictly excludes Student_ID, Performance_Band, and Performance_Change to prevent leakage.
    """
    missing_cols = [col for col in FEATURE_COLUMNS if col not in df.columns]
    if missing_cols:
        raise KeyError(f"Missing required feature columns: {missing_cols}")
        
    if TARGET_COLUMN not in df.columns:
        raise KeyError(f"Missing target column: {TARGET_COLUMN}")
        
    X = df[FEATURE_COLUMNS].copy()
    y = df[TARGET_COLUMN].copy()
    
    return X, y

def build_preprocessing_pipeline() -> ColumnTransformer:
    """
    Creates a Scikit-learn ColumnTransformer for preprocessing input features.
    - Numerical: Median Imputer + Standard Scaler
    - Categorical: Most Frequent Imputer + OneHotEncoder
    """
    num_pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler())
    ])
    
    cat_pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("onehot", OneHotEncoder(drop=None, handle_unknown="ignore", sparse_output=False))
    ])
    
    preprocessor = ColumnTransformer(
        transformers=[
            ("num", num_pipeline, NUMERICAL_FEATURES),
            ("cat", cat_pipeline, CATEGORICAL_FEATURES)
        ]
    )
    
    return preprocessor

def assign_performance_band(score: float) -> str:
    """
    Assigns performance band based on verified thresholds.
    """
    if score < 55.0:
        return "At Risk"
    elif score < 70.0:
        return "Average"
    elif score < 85.0:
        return "Good"
    else:
        return "Excellent"

if __name__ == "__main__":
    from data_loader import load_raw_data
    df_raw = load_raw_data()
    df_clean = clean_raw_data(df_raw)
    X, y = get_feature_target_split(df_clean)
    preprocessor = build_preprocessing_pipeline()
    X_trans = preprocessor.fit_transform(X)
    print(f"Cleaned shape: {df_clean.shape}")
    print(f"X shape: {X.shape}, y shape: {y.shape}")
    print(f"Transformed X shape: {X_trans.shape}")
