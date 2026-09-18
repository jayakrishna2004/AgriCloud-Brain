package com.agricloud.brain.controller;

import com.agricloud.brain.dto.PredictionRequest;
import com.agricloud.brain.dto.PredictionResponse;
import com.agricloud.brain.model.Prediction;
import com.agricloud.brain.service.PredictionService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/predictions")
public class PredictionController {

    private final PredictionService predictionService;

    public PredictionController(
            PredictionService predictionService
    ) {
        this.predictionService =
                predictionService;
    }

    @GetMapping
    public List<Prediction> getPredictions() {

        return predictionService
                .getAllPredictions();
    }

    @GetMapping("/latest")
    public Prediction getLatestPrediction() {

        return predictionService
                .getLatestPrediction();
    }

    @PostMapping
    public PredictionResponse createPrediction(
            @RequestBody PredictionRequest request
    ) {

        return predictionService
                .createPrediction(request);
    }
}