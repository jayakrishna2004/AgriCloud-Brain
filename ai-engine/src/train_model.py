import os

import numpy as np
import pandas as pd
import joblib

from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score

from feature_engineering import (
    prepare_features,
    FEATURE_COLUMNS
)

BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))
)

MODEL_DIR = os.path.join(
    BASE_DIR,
    "models"
)

MODEL_PATH = os.path.join(
    MODEL_DIR,
    "workload_model.pkl"
)


def generate_training_data(samples=2000):
    """
    Generate synthetic agricultural cloud
    workload data for initial model training.
    """

    np.random.seed(42)

    cpu = np.random.uniform(
        10,
        95,
        samples
    )

    memory = np.random.uniform(
        10,
        95,
        samples
    )

    workload = np.random.uniform(
        5,
        100,
        samples
    )

    instances = np.random.randint(
        1,
        10,
        samples
    )

    farmer_activity = np.random.uniform(
        0,
        100,
        samples
    )

    temperature = np.random.uniform(
        15,
        45,
        samples
    )

    rainfall = np.random.uniform(
        0,
        100,
        samples
    )

    # Simulated real workload relationship
    target = (
        workload * 0.40
        + cpu * 0.25
        + memory * 0.15
        + farmer_activity * 0.15
        + temperature * 0.05
    )

    # Weather can increase agricultural activity
    target += np.where(
        rainfall > 50,
        5,
        0
    )

    # Add small noise
    target += np.random.normal(
        0,
        3,
        samples
    )

    target = np.clip(
        target,
        0,
        100
    )

    data = pd.DataFrame({
        "cpu": cpu,
        "memory": memory,
        "workload": workload,
        "instances": instances,
        "farmer_activity": farmer_activity,
        "temperature": temperature,
        "rainfall": rainfall,
        "target": target
    })

    return data


def train():

    print("=" * 60)
    print("AgriCloud-Brain AI Model Training")
    print("=" * 60)

    os.makedirs(
        MODEL_DIR,
        exist_ok=True
    )

    data = generate_training_data()

    X = prepare_features(
        data[FEATURE_COLUMNS]
    )

    y = data["target"]

    X_train, X_test, y_train, y_test = (
        train_test_split(
            X,
            y,
            test_size=0.2,
            random_state=42
        )
    )

    model = RandomForestRegressor(
        n_estimators=150,
        max_depth=12,
        random_state=42,
        n_jobs=-1
    )

    print("\nTraining model...")

    model.fit(
        X_train,
        y_train
    )

    predictions = model.predict(
        X_test
    )

    mae = mean_absolute_error(
        y_test,
        predictions
    )

    r2 = r2_score(
        y_test,
        predictions
    )

    print("\nModel evaluation:")
    print(f"MAE: {mae:.2f}")
    print(f"R² : {r2:.2f}")

    joblib.dump(
        model,
        MODEL_PATH
    )

    print("\nModel saved:")
    print(MODEL_PATH)

    print("\nTraining completed successfully.")


if __name__ == "__main__":
    train()