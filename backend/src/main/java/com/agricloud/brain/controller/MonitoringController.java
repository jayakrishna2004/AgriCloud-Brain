package com.agricloud.brain.controller;

import com.agricloud.brain.dto.CloudMonitoringResponse;
import com.agricloud.brain.model.CloudMetric;
import com.agricloud.brain.service.MonitoringService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/monitoring")
public class MonitoringController {

    private final MonitoringService monitoringService;

    public MonitoringController(
            MonitoringService monitoringService
    ) {
        this.monitoringService =
                monitoringService;
    }

    // ==========================================
    // REAL AWS CLOUD MONITORING
    // ==========================================

    @GetMapping("/current")
    public CloudMonitoringResponse getCurrentMetrics() {

        return monitoringService
                .getCurrentMetrics();
    }

    // ==========================================
    // EXISTING DATABASE METRICS
    // ==========================================

    @GetMapping("/metrics")
    public List<CloudMetric> getMetrics() {

        return monitoringService
                .getMetrics();
    }

    @PostMapping("/metrics")
    public CloudMetric createMetric(
            @RequestBody CloudMetric metric
    ) {

        return monitoringService
                .saveMetric(metric);
    }
}