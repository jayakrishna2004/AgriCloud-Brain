package com.agricloud.brain.service;

import com.agricloud.brain.dto.PredictionRequest;
import com.agricloud.brain.dto.PredictionResponse;
import com.agricloud.brain.model.Prediction;
import com.agricloud.brain.repository.PredictionRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class PredictionService {

    private final PredictionRepository predictionRepository;
    private final RestTemplate restTemplate;

    @Value("${ai.engine.url:http://localhost:5000}")
    private String aiEngineUrl;

    public PredictionService(
            PredictionRepository predictionRepository,
            RestTemplate restTemplate
    ) {
        this.predictionRepository = predictionRepository;
        this.restTemplate = restTemplate;
    }

    // ==========================================
    // GET ALL PREDICTIONS
    // ==========================================

    public List<Prediction> getAllPredictions() {

        return predictionRepository.findAll();
    }

    // ==========================================
    // GET LATEST PREDICTION
    // ==========================================

    public Prediction getLatestPrediction() {

        return predictionRepository
                .findTopByOrderByPredictionTimeDesc()
                .orElse(null);
    }

    // ==========================================
    // CREATE AI PREDICTION
    // ==========================================

    public PredictionResponse createPrediction(
            PredictionRequest request
    ) {

        try {

            // Prepare data for Python AI engine

            Map<String, Object> aiRequest = Map.of(
                    "cpu", request.getCpu(),
                    "memory", request.getMemory(),
                    "workload", request.getWorkload(),
                    "instances", request.getInstances(),
                    "farmer_activity",
                        request.getWorkload(),
                    "temperature", 30.0,
                    "rainfall", 20.0
            );

            // Call Python AI Engine

            Map<?, ?> aiResponse =
                    restTemplate.postForObject(
                            aiEngineUrl + "/predict",
                            aiRequest,
                            Map.class
                    );

            if (aiResponse == null) {

                throw new RuntimeException(
                        "AI Engine returned empty response"
                );
            }

            // Read AI prediction

            double predictedLoad =
                    toDouble(
                            aiResponse.get(
                                    "predicted_load"
                            )
                    );

            double confidence =
                    toDouble(
                            aiResponse.get(
                                    "confidence"
                            )
                    );

            int recommendedInstances =
                    toInt(
                            aiResponse.get(
                                    "recommended_instances"
                            )
                    );

            // Save prediction to database

            Prediction prediction =
                    new Prediction();

            prediction.setPredictedLoad(
                    predictedLoad
            );

            prediction.setConfidence(
                    confidence
            );

            prediction.setRecommendedInstances(
                    recommendedInstances
            );

            prediction.setActualLoad(
                    request.getWorkload()
            );

            prediction.setPredictionTime(
                    LocalDateTime.now()
            );

            predictionRepository.save(
                    prediction
            );

            // Return response to frontend

            return new PredictionResponse(
                    predictedLoad,
                    confidence,
                    recommendedInstances,
                    request.getWorkload()
            );

        } catch (Exception error) {

            System.out.println(
                    "AI Engine error: "
                            + error.getMessage()
            );

            /*
             * Do NOT silently use the old
             * hard-coded prediction.
             *
             * Tell the frontend that the
             * AI engine is unavailable.
             */

            throw new RuntimeException(
                    "AI Engine is unavailable: "
                            + error.getMessage()
            );
        }
    }

    // ==========================================
    // HELPER METHODS
    // ==========================================

    private double toDouble(
            Object value
    ) {

        if (value == null) {
            return 0.0;
        }

        return Double.parseDouble(
                value.toString()
        );
    }

    private int toInt(
            Object value
    ) {

        if (value == null) {
            return 0;
        }

        return Integer.parseInt(
                value.toString()
        );
    }
}