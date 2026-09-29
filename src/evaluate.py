"""
Model Evaluation Module for Student Academic Performance Forecasting.
Evaluates model on held-out test data, computes MAE, RMSE, R2, performance band accuracy,
generates diagnostic charts, and saves evaluation reports.
"""

import os
import sys
import types
import json
import joblib
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Environment compatibility stub
if "sklearn.decomposition._cdnmf_fast" not in sys.modules:
    dummy_cdnmf = types.ModuleType("sklearn.decomposition._cdnmf_fast")
    dummy_cdnmf._update_cdnmf_fast = lambda *args, **kwargs: None
    sys.modules["sklearn.decomposition._cdnmf_fast"] = dummy_cdnmf

from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score, accuracy_score, confusion_matrix
from sklearn.model_selection import train_test_split

from data_loader import load_raw_data
from preprocessing import clean_raw_data, get_feature_target_split, assign_performance_band, FEATURE_COLUMNS, NUMERICAL_FEATURES, CATEGORICAL_FEATURES

MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "models", "rf_model.joblib")
REPORTS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "reports")
CHARTS_DIR = os.path.join(REPORTS_DIR, "charts")

def evaluate_saved_model(test_size=0.2, random_state=42):
    """
    Evaluates the saved pipeline on held-out test set.
    """
    os.makedirs(CHARTS_DIR, exist_ok=True)
    
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model file not found at {MODEL_PATH}. Please train the model first.")
        
    print(f"Loading saved pipeline from {MODEL_PATH}...")
    pipeline = joblib.load(MODEL_PATH)
    
    print("Loading and preparing test data...")
    raw_df = load_raw_data()
    cleaned_df = clean_raw_data(raw_df)
    X, y = get_feature_target_split(cleaned_df)
    
    _, X_test, _, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state
    )
    
    print("Generating predictions on held-out test set...")
    y_pred = pipeline.predict(X_test)
    
    # Calculate regression metrics
    mae = float(mean_absolute_error(y_test, y_pred))
    rmse = float(np.sqrt(mean_squared_error(y_test, y_pred)))
    r2 = float(r2_score(y_test, y_pred))
    
    # Band evaluation
    y_test_band = [assign_performance_band(s) for s in y_test]
    y_pred_band = [assign_performance_band(s) for s in y_pred]
    
    band_accuracy = float(accuracy_score(y_test_band, y_pred_band))
    band_labels = ["At Risk", "Average", "Good", "Excellent"]
    cm = confusion_matrix(y_test_band, y_pred_band, labels=band_labels).tolist()
    
    metrics = {
        "mae": round(mae, 4),
        "rmse": round(rmse, 4),
        "r2_score": round(r2, 4),
        "performance_band_accuracy": round(band_accuracy, 4),
        "test_samples": len(y_test),
        "confusion_matrix": cm,
        "band_labels": band_labels
    }
    
    print("\n================ MODEL EVALUATION METRICS ================")
    print(f"  MAE  : {mae:.4f}")
    print(f"  RMSE : {rmse:.4f}")
    print(f"  R²   : {r2:.4f}")
    print(f"  Band Classification Accuracy : {band_accuracy * 100:.2f}%")
    print("==========================================================")
    
    # Save metrics JSON
    metrics_file = os.path.join(REPORTS_DIR, "metrics.json")
    with open(metrics_file, "w") as f:
        json.dump(metrics, f, indent=2)
    print(f"Metrics saved to {metrics_file}")
    
    # 1. Actual vs Predicted Chart
    fig, ax = plt.subplots(figsize=(8, 6))
    sns.scatterplot(x=y_test, y=y_pred, alpha=0.6, color="#2980b9", ax=ax)
    min_val = min(y_test.min(), y_pred.min())
    max_val = max(y_test.max(), y_pred.max())
    ax.plot([min_val, max_val], [min_val, max_val], 'r--', label='Ideal Perfect Prediction (y = x)')
    ax.set_title("Actual vs Predicted Final Academic Score", fontsize=13, fontweight="bold", pad=12)
    ax.set_xlabel("Actual Score", fontsize=11)
    ax.set_ylabel("Predicted Score", fontsize=11)
    ax.legend()
    p1 = os.path.join(CHARTS_DIR, "actual_vs_predicted.png")
    fig.savefig(p1, dpi=300, bbox_inches="tight")
    plt.close(fig)

    # 2. Residual Plot
    residuals = y_test - y_pred
    fig, ax = plt.subplots(figsize=(8, 6))
    sns.scatterplot(x=y_pred, y=residuals, alpha=0.6, color="#e74c3c", ax=ax)
    ax.axhline(0, color="black", linestyle="--", linewidth=1)
    ax.set_title("Residual Plot (Errors vs Predicted Score)", fontsize=13, fontweight="bold", pad=12)
    ax.set_xlabel("Predicted Score", fontsize=11)
    ax.set_ylabel("Residual (Actual - Predicted)", fontsize=11)
    p2 = os.path.join(CHARTS_DIR, "residual_plot.png")
    fig.savefig(p2, dpi=300, bbox_inches="tight")
    plt.close(fig)

    # 3. Feature Importance Chart
    try:
        rf_model = pipeline.named_steps["model"]
        preprocessor = pipeline.named_steps["preprocessor"]
        
        # Get feature names from ColumnTransformer
        cat_encoder = preprocessor.named_transformers_["cat"].named_steps["onehot"]
        cat_feature_names = list(cat_encoder.get_feature_names_out(CATEGORICAL_FEATURES))
        all_feature_names = NUMERICAL_FEATURES + cat_feature_names
        
        importances = rf_model.feature_importances_
        
        # Create DataFrame
        feat_df = pd.DataFrame({
            "feature": all_feature_names[:len(importances)],
            "importance": importances
        }).sort_values(by="importance", ascending=False)
        
        fig, ax = plt.subplots(figsize=(9, 5))
        sns.barplot(data=feat_df, x="importance", y="feature", hue="feature", palette="Blues_r", legend=False, ax=ax)
        ax.set_title("Random Forest Feature Importance", fontsize=13, fontweight="bold", pad=12)
        ax.set_xlabel("Relative Importance", fontsize=11)
        ax.set_ylabel("Feature", fontsize=11)
        p3 = os.path.join(CHARTS_DIR, "feature_importance.png")
        fig.savefig(p3, dpi=300, bbox_inches="tight")
        plt.close(fig)
        
        metrics["feature_importances"] = feat_df.to_dict(orient="records")
        with open(metrics_file, "w") as f:
            json.dump(metrics, f, indent=2)
    except Exception as e:
        print(f"Note on feature importance generation: {e}")

    print("Evaluation charts saved to reports/charts/")
    return metrics

if __name__ == "__main__":
    evaluate_saved_model()
