import os
import joblib

# Support both:
# 1. Running from the project root with app.py
# 2. Running Python files directly from src
try:
    from src.feature_engineering import prepare_features
except ModuleNotFoundError:
    from feature_engineering import prepare_features


BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "models",
    "workload_model.pkl"
)


class WorkloadPredictor:

    def __init__(self):

        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(
                "workload_model.pkl not found. "
                "Run train_model.py first."
            )

        self.model = joblib.load(MODEL_PATH)

    def predict(self, data):

        features = prepare_features(data)

        prediction = self.model.predict(features)

        predicted_load = float(
            prediction[0]
        )

        # Keep workload between 0 and 100
        predicted_load = max(
            0,
            min(100, predicted_load)
        )

        recommended_instances = (
            self.calculate_instances(
                predicted_load
            )
        )

        return {
            "predicted_load": round(
                predicted_load,
                2
            ),
            "recommended_instances":
                recommended_instances
        }

    @staticmethod
    def calculate_instances(
        predicted_load
    ):

        if predicted_load >= 90:
            return 10

        if predicted_load >= 80:
            return 8

        if predicted_load >= 70:
            return 7

        if predicted_load >= 60:
            return 6

        if predicted_load >= 45:
            return 4

        if predicted_load >= 30:
            return 3

        return 2