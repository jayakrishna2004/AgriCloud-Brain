package com.agricloud.brain.dto;

public class ResourceResponse {

    private Long id;
    private String name;
    private String status;
    private double cpu;
    private double memory;
    private int instances;

    public ResourceResponse() {
    }

    public ResourceResponse(
            Long id,
            String name,
            String status,
            double cpu,
            double memory,
            int instances
    ) {
        this.id = id;
        this.name = name;
        this.status = status;
        this.cpu = cpu;
        this.memory = memory;
        this.instances = instances;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public double getCpu() {
        return cpu;
    }

    public void setCpu(double cpu) {
        this.cpu = cpu;
    }

    public double getMemory() {
        return memory;
    }

    public void setMemory(double memory) {
        this.memory = memory;
    }

    public int getInstances() {
        return instances;
    }

    public void setInstances(int instances) {
        this.instances = instances;
    }
}