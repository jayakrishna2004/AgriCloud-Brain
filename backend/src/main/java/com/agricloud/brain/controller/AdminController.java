package com.agricloud.brain.controller;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @GetMapping("/dashboard")
    public Map<String, Object> dashboard() {

        return Map.of(
                "status", "OK",
                "service", "AgriCloud-Brain",
                "message",
                "Admin dashboard is running"
        );
    }

    @GetMapping("/health")
    public Map<String, String> health() {

        return Map.of(
                "status", "healthy"
        );
    }
}