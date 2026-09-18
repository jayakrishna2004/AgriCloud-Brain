package com.agricloud.brain.model;

import jakarta.persistence.*;

@Entity
@Table(name = "cloud_resources")
public class CloudResource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String status;

    private double cpu;

    private double memory;

    private int instances;

    public CloudResource() {
    }

    public CloudResource(
            String name,
            String status,
            double cpu,
            double memory,
            int instances
    ) {
        this.name = name;
        this.status = status;
        this.cpu = cpu;
        this.memory = memory;
        this.instances = instances;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getStatus() {
        return status;
    }

    public double getCpu() {
        return cpu;
    }

    public double getMemory() {
        return memory;
    }

    public int getInstances() {
        return instances;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setCpu(double cpu) {
        this.cpu = cpu;
    }

    public void setMemory(double memory) {
        this.memory = memory;
    }

    public void setInstances(int instances) {
        this.instances = instances;
    }
}