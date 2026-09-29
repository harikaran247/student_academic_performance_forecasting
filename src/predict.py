"""
Inference Engine and Academic Insights Module for Student Academic Performance Forecasting.
Loads trained Scikit-Learn pipeline, validates student input records, computes predicted final score,
determines performance band, checks for academic decline, and delivers actionable recommendations.
"""

import os
import sys
import types
import json
import joblib
import pandas as pd
import numpy as np

# Environment compatibility stub
if "sklearn.decomposition._cdnmf_fast" not in sys.modules:
    dummy_cdnmf = types.ModuleType("sklearn.decomposition._cdnmf_fast")
    dummy_cdnmf._update_cdnmf_fast = lambda *args, **kwargs: None
    sys.modules["sklearn.decomposition._cdnmf_fast"] = dummy_cdnmf

from preprocessing import assign_performance_band, FEATURE_COLUMNS

MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "models", "rf_model.joblib")
META_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "models", "model_meta.json")

def load_prediction_model():
    """
    Loads saved model pipeline and metadata.
    """
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model file not found at {MODEL_PATH}. Train the model first.")
        
    pipeline = joblib.load(MODEL_PATH)
    
    metadata = {}
    if os.path.exists(META_PATH):
        with open(META_PATH, "r") as f:
            metadata = json.load(f)
            
    return pipeline, metadata

def validate_student_input(data: dict) -> dict:
    """
    Validates and converts student input dictionary.
    Raises ValueError on invalid or out-of-range values.
    """
    validated = {}
    
    # 1. Attendance
    att = float(data.get("Attendance_Percentage", 75.0))
    if not (0.0 <= att <= 100.0):
        raise ValueError(f"Attendance Percentage ({att}) must be between 0 and 100.")
    validated["Attendance_Percentage"] = att
    
    # 2. Internal Marks
    internal = float(data.get("Internal_Marks", 70.0))
    if not (0.0 <= internal <= 100.0):
        raise ValueError(f"Internal Marks ({internal}) must be between 0 and 100.")
    validated["Internal_Marks"] = internal

    # 3. Assignment Score
    assign = float(data.get("Assignment_Score", 70.0))
    if not (0.0 <= assign <= 100.0):
        raise ValueError(f"Assignment Score ({assign}) must be between 0 and 100.")
    validated["Assignment_Score"] = assign

    # 4. Previous Semester Score
    prev_score = float(data.get("Previous_Semester_Score", 70.0))
    if not (0.0 <= prev_score <= 100.0):
        raise ValueError(f"Previous Semester Score ({prev_score}) must be between 0 and 100.")
    validated["Previous_Semester_Score"] = prev_score

    # 5. Study Hours Per Day
    hours = float(data.get("Study_Hours_Per_Day", 3.5))
    if not (0.0 <= hours <= 24.0):
        raise ValueError(f"Study Hours Per Day ({hours}) must be between 0 and 24.")
    validated["Study_Hours_Per_Day"] = hours

    # 6. Engagement Level
    eng = str(data.get("Engagement_Level", "Medium")).strip().capitalize()
    if eng not in ["Low", "Medium", "High"]:
        raise ValueError(f"Engagement Level ({eng}) must be 'Low', 'Medium', or 'High'.")
    validated["Engagement_Level"] = eng
    
    return validated

def predict_student_performance(student_dict: dict, pipeline=None):
    """
    Predicts final academic score, performance band, and performance change.
    """
    if pipeline is None:
        pipeline, _ = load_prediction_model()
        
    clean_input = validate_student_input(student_dict)
    input_df = pd.DataFrame([clean_input])[FEATURE_COLUMNS]
    
    # Raw regression score prediction
    predicted_score = float(pipeline.predict(input_df)[0])
    # Clip prediction to valid range 0 - 100
    predicted_score = max(0.0, min(100.0, predicted_score))
    
    # Compute performance change relative to previous semester
    prev_score = clean_input["Previous_Semester_Score"]
    performance_change = predicted_score - prev_score
    
    # Performance band
    performance_band = assign_performance_band(predicted_score)
    
    # Decline detection logic (information available at prediction time)
    is_decline = performance_change < 0.0
    decline_severity = "None"
    if performance_change < -10.0:
        decline_severity = "Severe"
    elif performance_change < -5.0:
        decline_severity = "Moderate"
    elif performance_change < 0.0:
        decline_severity = "Minor"
        
    results = {
        "input_features": clean_input,
        "predicted_final_score": round(predicted_score, 2),
        "previous_semester_score": round(prev_score, 2),
        "performance_change": round(performance_change, 2),
        "performance_band": performance_band,
        "is_academic_decline": is_decline,
        "decline_severity": decline_severity
    }
    
    return results

def generate_academic_support_suggestions(prediction_result: dict) -> dict:
    """
    Generates actionable, practical academic support recommendations based on input features and predicted outcome.
    """
    inputs = prediction_result["input_features"]
    predicted_score = prediction_result["predicted_final_score"]
    change = prediction_result["performance_change"]
    band = prediction_result["performance_band"]
    
    strengths = []
    vulnerabilities = []
    action_plan = []

    # 1. Attendance Analysis
    if inputs["Attendance_Percentage"] < 75.0:
        vulnerabilities.append(f"Low attendance rate ({inputs['Attendance_Percentage']}%), below the standard 75% threshold.")
        action_plan.append("Attend mandatory counseling and set up attendance tracking notifications.")
    else:
        strengths.append(f"Good class attendance ({inputs['Attendance_Percentage']}%).")

    # 2. Internal Marks Analysis
    if inputs["Internal_Marks"] < 60.0:
        vulnerabilities.append(f"Sub-optimal internal evaluation score ({inputs['Internal_Marks']}/100).")
        action_plan.append("Schedule weekly remedial tutoring and request detailed faculty feedback on internal tests.")
    else:
        strengths.append(f"Solid internal exam scores ({inputs['Internal_Marks']}/100).")

    # 3. Study Hours Analysis
    if inputs["Study_Hours_Per_Day"] < 2.5:
        vulnerabilities.append(f"Limited daily study effort ({inputs['Study_Hours_Per_Day']} hrs/day).")
        action_plan.append("Implement structured study timetables aiming for at least 3-4 hours of focused study daily.")
    else:
        strengths.append(f"Dedicated self-study routine ({inputs['Study_Hours_Per_Day']} hrs/day).")

    # 4. Engagement Level
    if inputs["Engagement_Level"] == "Low":
        vulnerabilities.append("Low classroom engagement level.")
        action_plan.append("Participate in interactive group discussions, lab workshops, and peer study groups.")

    # 5. Performance Change & Band specific advice
    if change < 0:
        action_plan.append(f"Academic decline flagged (-{abs(change):.1f} points drop). Early intervention recommended before final exams.")
        
    if band == "At Risk":
        action_plan.append("URGENT: Enroll in comprehensive academic recovery plan and peer mentoring.")
    elif band == "Average":
        action_plan.append("Target specific weaker subjects to elevate performance into the Good band.")
    elif band in ["Good", "Excellent"]:
        action_plan.append("Maintain current study strategies and consider peer mentoring or advanced projects.")

    return {
        "strengths": strengths,
        "vulnerabilities": vulnerabilities,
        "action_plan": action_plan,
        "disclaimer": "Predictions are statistical estimates generated by Random Forest model and are not guaranteed outcomes."
    }

if __name__ == "__main__":
    test_student = {
        "Attendance_Percentage": 65.0,
        "Internal_Marks": 52.0,
        "Assignment_Score": 60.0,
        "Previous_Semester_Score": 75.0,
        "Study_Hours_Per_Day": 2.0,
        "Engagement_Level": "Low"
    }
    
    print("Testing prediction for sample student...")
    res = predict_student_performance(test_student)
    print("Prediction Results:")
    print(json.dumps(res, indent=2))
    
    rec = generate_academic_support_suggestions(res)
    print("\nAcademic Support Suggestions:")
    print(json.dumps(rec, indent=2))
