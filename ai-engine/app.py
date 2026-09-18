from flask import Flask, request, jsonify
from flask_cors import CORS

from src.workload_predictor import WorkloadPredictor


app = Flask(__name__)

CORS(app)

predictor = None


def get_predictor():

    global predictor

    if predictor is None:
        predictor = WorkloadPredictor()

    return predictor


@app.route("/", methods=["GET"])
def home():

    return jsonify({
        "application": "AgriCloud-Brain AI Engine",
        "status": "UP",
        "service": "Workload Prediction API"
    })


@app.route("/health", methods=["GET"])
def health():

    return jsonify({
        "status": "healthy",
        "model": "Random Forest"
    })


@app.route("/predict", methods=["POST"])
def predict():

    try:

        data = request.get_json()

        if not data:

            return jsonify({
                "error": "Request body is required"
            }), 400

        model = get_predictor()

        result = model.predict(
            data
        )

        # Add confidence estimation
        predicted_load = result[
            "predicted_load"
        ]

        confidence = calculate_confidence(
            predicted_load
        )

        result["confidence"] = confidence

        return jsonify(result)

    except Exception as error:

        return jsonify({
            "error": str(error)
        }), 500


def calculate_confidence(
    predicted_load
):

    # Simple confidence estimate
    # for initial prototype

    if predicted_load >= 80:
        return 92.0

    if predicted_load >= 60:
        return 90.0

    if predicted_load >= 40:
        return 88.0

    return 85.0


if __name__ == "__main__":

    print("=" * 60)
    print("AgriCloud-Brain AI Engine")
    print("=" * 60)
    print("Starting Flask API...")
    print("URL: http://localhost:5000")
    print("=" * 60)

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )