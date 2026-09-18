package com.agricloud.brain.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "predictions")
public class Prediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double predictedLoad;

    private double confidence;

    private int recommendedInstances;

    private double actualLoad;

    private LocalDateTime predictionTime;

    public Prediction() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public LocalDateTime getPredictionTime() {
        return predictionTime;
    }

    public void setPredictionTime(LocalDateTime predictionTime) {
        this.predictionTime = predictionTime;
    }
}