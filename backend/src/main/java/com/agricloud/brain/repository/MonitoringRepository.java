package com.agricloud.brain.repository;

import com.agricloud.brain.model.CloudMetric;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MonitoringRepository
        extends JpaRepository<CloudMetric, Long> {
}