package com.agricloud.brain.dto;

public class PredictionResponse {

    private double predictedLoad;
    private double confidence;
    private int recommendedInstances;
    private double actualLoad;

    public PredictionResponse() {
    }

    public PredictionResponse(
            double predictedLoad,
            double confidence,
            int recommendedInstances,
            double actualLoad
    ) {
        this.predictedLoad = predictedLoad;
        this.confidence = confidence;
        this.recommendedInstances = recommendedInstances;
        this.actualLoad = actualLoad;
    }

    public double getPredictedLoad() {
        return predictedLoad;
    }

    public void setPredictedLoad(double predictedLoad) {
        this.predictedLoad = predictedLoad;
    }

    public double getConfidence() {
        return confidence;
    }

    public void setConfidence(double confidence) {
        this.confidence = confidence;
    }

    public int getRecommendedInstances() {
        return recommendedInstances;
    }

    public void setRecommendedInstances(int recommendedInstances) {
        this.recommendedInstances = recommendedInstances;
    }

    public double getActualLoad() {
        return actualLoad;
    }

    public void setActualLoad(double actualLoad) {
        this.actualLoad = actualLoad;
    }
}