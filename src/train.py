"""
Model Training Module for Student Academic Performance Forecasting.
Trains the Random Forest Regressor within a Scikit-Learn Pipeline on training data only
and persists the model and metadata via Joblib.
"""

import os
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline

from data_loader import load_raw_data
from preprocessing import (
    clean_raw_data,
    get_feature_target_split,
    build_preprocessing_pipeline,
    FEATURE_COLUMNS,
    NUMERICAL_FEATURES,
    CATEGORICAL_FEATURES,
    TARGET_COLUMN,
    BAND_THRESHOLDS
)
from model_utils import get_random_forest_regressor

MODEL_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "models")
MODEL_PATH = os.path.join(MODEL_DIR, "rf_model.joblib")
META_PATH = os.path.join(MODEL_DIR, "model_meta.json")

def train_and_save_model(data_path=None, test_size=0.2, random_state=42):
    """
    Executes end-to-end model training:
    1. Loads and cleans raw data
    2. Splits into train/test sets
    3. Builds Scikit-Learn Pipeline (Preprocessor + Random Forest)
    4. Fits on train data ONLY
    5. Saves pipeline and metadata to disk
    """
    os.makedirs(MODEL_DIR, exist_ok=True)
    
    print("Loading raw dataset...")
    raw_df = load_raw_data(data_path)
    
    print("Cleaning dataset (deduplication & out-of-bound handling)...")
    cleaned_df = clean_raw_data(raw_df)
    
    print(f"Cleaned dataset shape: {cleaned_df.shape}")
    X, y = get_feature_target_split(cleaned_df)
    
    print(f"Splitting data into train ({100*(1-test_size):.0f}%) and test ({100*test_size:.0f}%)...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state
    )
    
    print("Building Scikit-Learn Pipeline...")
    preprocessor = build_preprocessing_pipeline()
    model = get_random_forest_regressor(n_estimators=100, max_depth=12, random_state=random_state)
    
    pipeline = Pipeline([
        ("preprocessor", preprocessor),
        ("model", model)
    ])
    
    print("Training Random Forest Regressor on training set ONLY...")
    pipeline.fit(X_train, y_train)
    
    print(f"Saving fitted pipeline to {MODEL_PATH}...")
    joblib.dump(pipeline, MODEL_PATH)
    
    # Metadata dictionary for reproducibility and feature validation
    metadata = {
        "feature_columns": FEATURE_COLUMNS,
        "numerical_features": NUMERICAL_FEATURES,
        "categorical_features": CATEGORICAL_FEATURES,
        "target_column": TARGET_COLUMN,
        "band_thresholds": BAND_THRESHOLDS,
        "random_state": random_state,
        "test_size": test_size,
        "train_samples": int(len(X_train)),
        "test_samples": int(len(X_test)),
        "model_type": "RandomForestRegressor"
    }
    
    print(f"Saving metadata to {META_PATH}...")
    with open(META_PATH, "w") as f:
        json.dump(metadata, f, indent=2)
        
    print("Model training & persistence completed successfully!")
    return pipeline, X_train, X_test, y_train, y_test

if __name__ == "__main__":
    train_and_save_model()
