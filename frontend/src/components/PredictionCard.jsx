import { Brain, TrendingUp } from "lucide-react";

function PredictionCard({
  predictedLoad,
  confidence,
  recommendedInstances
}) {

  return (
    <div className="prediction-card">

      <div className="prediction-icon">
        <Brain size={28} />
      </div>

      <div className="prediction-content">

        <h3>AI Workload Prediction</h3>

        <div className="prediction-number">
          {predictedLoad}%
        </div>

        <p>
          Predicted workload for the next period
        </p>

        <div className="prediction-details">

          <span>
            Confidence: {confidence}%
          </span>

          <span>
            <TrendingUp size={16} />

            Recommended Instances:{" "}
            {recommendedInstances}
          </span>

        </div>

      </div>

    </div>
  );
}

export default PredictionCard;