"""
Exploratory Data Analysis (EDA) Module.
Generates publication-quality charts and saves them in reports/charts/.
"""

import os
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np

# Set consistent styling
plt.style.use("seaborn-v0_8-whitegrid" if "seaborn-v0_8-whitegrid" in plt.style.available else "default")
plt.rcParams["font.sans-serif"] = "Arial"
plt.rcParams["axes.edgecolor"] = "#cccccc"
plt.rcParams["axes.linewidth"] = 0.8

CHARTS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "reports", "charts")

def generate_eda_plots(df: pd.DataFrame, output_dir=None):
    """
    Generates and saves EDA charts from cleaned dataframe.
    """
    if output_dir is None:
        output_dir = CHARTS_DIR
    os.makedirs(output_dir, exist_ok=True)
    
    generated_files = {}

    # 1. Target Score Distribution
    fig, ax = plt.subplots(figsize=(8, 5))
    sns.histplot(df["Final_Academic_Score"], kde=True, color="#2b5c8f", bins=30, ax=ax)
    ax.set_title("Distribution of Final Academic Score", fontsize=14, fontweight="bold", pad=12)
    ax.set_xlabel("Final Academic Score (0 - 100)", fontsize=11)
    ax.set_ylabel("Student Count", fontsize=11)
    p1 = os.path.join(output_dir, "score_distribution.png")
    fig.savefig(p1, dpi=300, bbox_inches="tight")
    plt.close(fig)
    generated_files["score_distribution"] = p1

    # 2. Correlation Heatmap
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    # Drop identifier if present
    numeric_cols = [c for c in numeric_cols if c != "Student_ID"]
    
    fig, ax = plt.subplots(figsize=(9, 7))
    corr = df[numeric_cols].corr()
    sns.heatmap(corr, annot=True, fmt=".2f", cmap="Blues", cbar=True, ax=ax, square=True, linewidths=0.5)
    ax.set_title("Correlation Heatmap of Academic Features", fontsize=14, fontweight="bold", pad=12)
    p2 = os.path.join(output_dir, "correlation_heatmap.png")
    fig.savefig(p2, dpi=300, bbox_inches="tight")
    plt.close(fig)
    generated_files["correlation_heatmap"] = p2

    # 3. Categorical Band Distribution
    if "Performance_Band" in df.columns:
        fig, ax = plt.subplots(figsize=(8, 5))
        band_order = ["At Risk", "Average", "Good", "Excellent"]
        palette = {"At Risk": "#e74c3c", "Average": "#f39c12", "Good": "#3498db", "Excellent": "#2ecc71"}
        sns.countplot(data=df, x="Performance_Band", order=band_order, palette=palette, ax=ax)
        ax.set_title("Student Distribution Across Performance Bands", fontsize=14, fontweight="bold", pad=12)
        ax.set_xlabel("Performance Band", fontsize=11)
        ax.set_ylabel("Number of Students", fontsize=11)
        
        # Add value annotations
        for p in ax.patches:
            height = p.get_height()
            if not np.isnan(height) and height > 0:
                ax.annotate(f"{int(height)}", (p.get_x() + p.get_width() / 2., height + 30),
                            ha='center', va='bottom', fontsize=10, fontweight='bold')
                            
        p3 = os.path.join(output_dir, "performance_band_count.png")
        fig.savefig(p3, dpi=300, bbox_inches="tight")
        plt.close(fig)
        generated_files["performance_band_count"] = p3

    # 4. Engagement Level vs Score Boxplot
    if "Engagement_Level" in df.columns:
        fig, ax = plt.subplots(figsize=(8, 5))
        sns.boxplot(data=df, x="Engagement_Level", y="Final_Academic_Score", 
                    order=["Low", "Medium", "High"], palette="Purples", ax=ax)
        ax.set_title("Final Academic Score by Engagement Level", fontsize=14, fontweight="bold", pad=12)
        ax.set_xlabel("Engagement Level", fontsize=11)
        ax.set_ylabel("Final Academic Score", fontsize=11)
        p4 = os.path.join(output_dir, "engagement_vs_score.png")
        fig.savefig(p4, dpi=300, bbox_inches="tight")
        plt.close(fig)
        generated_files["engagement_vs_score"] = p4

    # 5. Numerical Features Scatter Grid vs Target
    features = ["Attendance_Percentage", "Internal_Marks", "Assignment_Score", "Previous_Semester_Score", "Study_Hours_Per_Day"]
    fig, axes = plt.subplots(2, 3, figsize=(15, 9))
    axes = axes.flatten()
    
    for idx, feature in enumerate(features):
        if feature in df.columns:
            sns.scatterplot(data=df, x=feature, y="Final_Academic_Score", alpha=0.5, color="#1f77b4", ax=axes[idx])
            axes[idx].set_title(f"{feature} vs Final Score", fontsize=11, fontweight="bold")
            axes[idx].set_xlabel(feature, fontsize=9)
            axes[idx].set_ylabel("Final Score", fontsize=9)
            
    # Hide 6th subplot
    if len(features) < len(axes):
        fig.delaxes(axes[-1])
        
    plt.tight_layout()
    p5 = os.path.join(output_dir, "feature_vs_target.png")
    fig.savefig(p5, dpi=300, bbox_inches="tight")
    plt.close(fig)
    generated_files["feature_vs_target"] = p5

    return generated_files

if __name__ == "__main__":
    from data_loader import load_raw_data
    from preprocessing import clean_raw_data
    df = clean_raw_data(load_raw_data())
    charts = generate_eda_plots(df)
    print("Generated EDA Charts:")
    for k, v in charts.items():
        print(f"  {k}: {v}")
