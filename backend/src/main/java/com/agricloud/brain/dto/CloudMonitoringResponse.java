package com.agricloud.brain.dto;

public class CloudMonitoringResponse {

    private double cpuUsage;
    private double memoryUsage;
    private double workload;
    private int instances;
    private String status;
    private String provider;
    private String timestamp;

    public CloudMonitoringResponse() {
    }

    public CloudMonitoringResponse(
            double cpuUsage,
            double memoryUsage,
            double workload,
            int instances,
            String status,
            String provider,
            String timestamp
    ) {
        this.cpuUsage = cpuUsage;
        this.memoryUsage = memoryUsage;
        this.workload = workload;
        this.instances = instances;
        this.status = status;
        this.provider = provider;
        this.timestamp = timestamp;
    }

    public double getCpuUsage() {
        return cpuUsage;
    }

    public void setCpuUsage(double cpuUsage) {
        this.cpuUsage = cpuUsage;
    }

    public double getMemoryUsage() {
        return memoryUsage;
    }

    public void setMemoryUsage(double memoryUsage) {
        this.memoryUsage = memoryUsage;
    }

    public double getWorkload() {
        return workload;
    }

    public void setWorkload(double workload) {
        this.workload = workload;
    }

    public int getInstances() {
        return instances;
    }

    public void setInstances(int instances) {
        this.instances = instances;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}