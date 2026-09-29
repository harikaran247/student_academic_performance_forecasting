"""
Automated Test Suite for Student Academic Performance Forecasting.
Tests data loading, preprocessing, model training artifacts, prediction API, and edge cases.
"""

import os
import sys
import types
import json
import pandas as pd
import numpy as np

# Add src to Python Path
SRC_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "src")
if SRC_PATH not in sys.path:
    sys.path.insert(0, SRC_PATH)

# Environment compatibility stub
if "sklearn.decomposition._cdnmf_fast" not in sys.modules:
    dummy_cdnmf = types.ModuleType("sklearn.decomposition._cdnmf_fast")
    dummy_cdnmf._update_cdnmf_fast = lambda *args, **kwargs: None
    sys.modules["sklearn.decomposition._cdnmf_fast"] = dummy_cdnmf

from data_loader import load_raw_data, resolve_dataset_path, get_data_summary
from preprocessing import clean_raw_data, get_feature_target_split, assign_performance_band
from predict import predict_student_performance, validate_student_input, generate_academic_support_suggestions

def test_data_loader():
    path = resolve_dataset_path()
    assert os.path.exists(path), f"Dataset path {path} does not exist"
    df = load_raw_data(path)
    assert len(df) > 0, "Loaded dataframe is empty"
    summary = get_data_summary(df)
    assert summary["num_rows"] == 5010, f"Expected 5010 rows, got {summary['num_rows']}"

def test_preprocessing():
    df_raw = load_raw_data()
    df_clean = clean_raw_data(df_raw)
    assert len(df_clean) == 5000, f"Expected 5000 cleaned rows after deduplication, got {len(df_clean)}"
    
    # Check invalid values were sanitized to NaN
    assert not (df_clean["Attendance_Percentage"] < 0).any()
    assert not (df_clean["Attendance_Percentage"] > 100).any()
    assert not (df_clean["Internal_Marks"] > 100).any()

    X, y = get_feature_target_split(df_clean)
    assert "Student_ID" not in X.columns
    assert "Performance_Band" not in X.columns
    assert "Performance_Change" not in X.columns
    assert len(y) == 5000

def test_performance_band_assignment():
    assert assign_performance_band(45.0) == "At Risk"
    assert assign_performance_band(60.0) == "Average"
    assert assign_performance_band(78.0) == "Good"
    assert assign_performance_band(90.0) == "Excellent"

def test_prediction_edge_cases():
    # 1. Excellent student
    high_student = {
        "Attendance_Percentage": 98.0,
        "Internal_Marks": 92.0,
        "Assignment_Score": 95.0,
        "Previous_Semester_Score": 90.0,
        "Study_Hours_Per_Day": 6.5,
        "Engagement_Level": "High"
    }
    res_high = predict_student_performance(high_student)
    assert res_high["predicted_final_score"] >= 75.0
    assert res_high["performance_band"] in ["Good", "Excellent"]

    # 2. At Risk / Declining student
    low_student = {
        "Attendance_Percentage": 40.0,
        "Internal_Marks": 35.0,
        "Assignment_Score": 45.0,
        "Previous_Semester_Score": 70.0,
        "Study_Hours_Per_Day": 1.0,
        "Engagement_Level": "Low"
    }
    res_low = predict_student_performance(low_student)
    assert res_low["predicted_final_score"] < 65.0
    assert res_low["is_academic_decline"] == True

def test_input_validation_errors():
    invalid_input = {
        "Attendance_Percentage": 150.0, # invalid
        "Internal_Marks": 70.0,
        "Assignment_Score": 70.0,
        "Previous_Semester_Score": 70.0,
        "Study_Hours_Per_Day": 4.0,
        "Engagement_Level": "Medium"
    }
    try:
        validate_student_input(invalid_input)
        assert False, "Should have raised ValueError for attendance > 100"
    except ValueError:
        pass

if __name__ == "__main__":
    print("Running automated tests...")
    test_data_loader()
    print("  [OK] test_data_loader PASSED")
    test_preprocessing()
    print("  [OK] test_preprocessing PASSED")
    test_performance_band_assignment()
    print("  [OK] test_performance_band_assignment PASSED")
    test_prediction_edge_cases()
    print("  [OK] test_prediction_edge_cases PASSED")
    test_input_validation_errors()
    print("  [OK] test_input_validation_errors PASSED")
    print("\nALL AUTOMATED TESTS PASSED SUCCESSFULLY!")
