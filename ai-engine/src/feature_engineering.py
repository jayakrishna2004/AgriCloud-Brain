import pandas as pd
import numpy as np


FEATURE_COLUMNS = [
    "cpu",
    "memory",
    "workload",
    "instances",
    "farmer_activity",
    "temperature",
    "rainfall"
]


def prepare_features(data):
    """
    Convert input data into ML features.
    """

    if isinstance(data, dict):
        df = pd.DataFrame([data])
    else:
        df = data.copy()

    # Add missing features with sensible defaults
    defaults = {
        "cpu": 50.0,
        "memory": 50.0,
        "workload": 50.0,
        "instances": 2,
        "farmer_activity": 50.0,
        "temperature": 25.0,
        "rainfall": 0.0
    }

    for column, default in defaults.items():

        if column not in df.columns:
            df[column] = default

    # Convert values to numeric
    for column in FEATURE_COLUMNS:
        df[column] = pd.to_numeric(
            df[column],
            errors="coerce"
        )

    # Replace invalid values
    df[FEATURE_COLUMNS] = (
        df[FEATURE_COLUMNS]
        .replace([np.inf, -np.inf], np.nan)
        .fillna(0)
    )

    # Keep values within reasonable ranges
    df["cpu"] = df["cpu"].clip(0, 100)

    df["memory"] = df["memory"].clip(0, 100)

    df["workload"] = df["workload"].clip(0, 100)

    df["instances"] = df["instances"].clip(1, 100)

    df["farmer_activity"] = (
        df["farmer_activity"].clip(0, 100)
    )

    df["temperature"] = (
        df["temperature"].clip(-50, 60)
    )

    df["rainfall"] = (
        df["rainfall"].clip(0, 500)
    )

    return df[FEATURE_COLUMNS]