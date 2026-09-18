package com.agricloud.brain.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class AIEngineService {

    private final RestTemplate restTemplate;

    @Value("${ai.engine.url:http://localhost:5000}")
    private String aiEngineUrl;

    public AIEngineService(
            RestTemplate restTemplate
    ) {
        this.restTemplate = restTemplate;
    }

    public Object predict(Map<String, Object> data) {

        try {

            return restTemplate.postForObject(
                    aiEngineUrl + "/predict",
                    data,
                    Object.class
            );

        } catch (Exception e) {

            return Map.of(
                    "status", "AI_ENGINE_UNAVAILABLE",
                    "message",
                    "AI engine is currently unavailable"
            );
        }
    }
}