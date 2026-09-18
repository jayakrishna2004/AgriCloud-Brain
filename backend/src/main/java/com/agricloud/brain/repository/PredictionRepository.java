package com.agricloud.brain.repository;

import com.agricloud.brain.model.Prediction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PredictionRepository
        extends JpaRepository<Prediction, Long> {

    Optional<Prediction>
    findTopByOrderByPredictionTimeDesc();
}