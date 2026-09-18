package com.agricloud.brain.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "cloud_metrics")
public class CloudMetric {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double cpu;

    private double memory;

    private double workload;

    private int instances;

    private LocalDateTime recordedAt;

    public CloudMetric() {
    }

    public Long getId() {
        return id;
    }

    public double getCpu() {
        return cpu;
    }

    public double getMemory() {
        return memory;
    }

    public double getWorkload() {
        return workload;
    }

    public int getInstances() {
        return instances;
    }

    public LocalDateTime getRecordedAt() {
        return recordedAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setCpu(double cpu) {
        this.cpu = cpu;
    }

    public void setMemory(double memory) {
        this.memory = memory;
    }

    public void setWorkload(double workload) {
        this.workload = workload;
    }

    public void setInstances(int instances) {
        this.instances = instances;
    }

    public void setRecordedAt(LocalDateTime recordedAt) {
        this.recordedAt = recordedAt;
    }
}