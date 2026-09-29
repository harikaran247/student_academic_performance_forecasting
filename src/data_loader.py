import os
import glob
import pandas as pd

DEFAULT_DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")

def resolve_dataset_path(data_dir=None):
    """
    Finds the dataset file in the specified directory.
    Supports student_performance_challenge33.csv and student_performance_challenge33.csv (1).xls
    without mutating or deleting original files.
    """
    if data_dir is None:
        data_dir = DEFAULT_DATA_DIR

    possible_files = [
        os.path.join(data_dir, "student_performance_challenge33.csv"),
        os.path.join(data_dir, "student_performance_challenge33.csv (1).xls")
    ]
    
    for fpath in possible_files:
        if os.path.exists(fpath):
            return fpath
            
    # Fallback to search any csv or xls file in data_dir
    patterns = [os.path.join(data_dir, "*.csv"), os.path.join(data_dir, "*.xls")]
    for pat in patterns:
        matches = glob.glob(pat)
        if matches:
            return matches[0]
            
    raise FileNotFoundError(f"No student performance dataset found in '{data_dir}'")

def load_raw_data(data_path=None):
    """
    Loads the raw dataset into a Pandas DataFrame.
    """
    if data_path is None:
        data_path = resolve_dataset_path()
        
    df = pd.read_csv(data_path)
    return df

def get_data_summary(df):
    """
    Computes summary metrics for data understanding.
    """
    summary = {
        "num_rows": int(df.shape[0]),
        "num_cols": int(df.shape[1]),
        "columns": list(df.columns),
        "dtypes": {col: str(dtype) for col, dtype in df.dtypes.items()},
        "missing_values": {col: int(val) for col, val in df.isnull().sum().items()},
        "exact_duplicates": int(df.duplicated().sum()),
        "student_id_duplicates": int(df["Student_ID"].duplicated().sum()) if "Student_ID" in df.columns else 0,
        "out_of_bound_attendance": int(((df["Attendance_Percentage"] < 0) | (df["Attendance_Percentage"] > 100)).sum()) if "Attendance_Percentage" in df.columns else 0,
        "out_of_bound_internal": int((df["Internal_Marks"] > 100).sum()) if "Internal_Marks" in df.columns else 0,
        "performance_bands": df["Performance_Band"].value_counts().to_dict() if "Performance_Band" in df.columns else {}
    }
    return summary

if __name__ == "__main__":
    path = resolve_dataset_path()
    print(f"Resolved dataset path: {path}")
    df_raw = load_raw_data(path)
    print("Raw Data Summary:")
    print(get_data_summary(df_raw))
