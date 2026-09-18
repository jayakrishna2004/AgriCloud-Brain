package com.agricloud.brain.service;

import com.agricloud.brain.dto.ResourceResponse;
import com.agricloud.brain.model.CloudResource;
import com.agricloud.brain.repository.ResourceRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResourceService {

    private final ResourceRepository resourceRepository;

    public ResourceService(
            ResourceRepository resourceRepository
    ) {
        this.resourceRepository = resourceRepository;
    }

    public List<ResourceResponse> getResources() {

        return resourceRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private ResourceResponse toResponse(
            CloudResource resource
    ) {

        return new ResourceResponse(
                resource.getId(),
                resource.getName(),
                resource.getStatus(),
                resource.getCpu(),
                resource.getMemory(),
                resource.getInstances()
        );
    }

    public CloudResource save(
            CloudResource resource
    ) {
        return resourceRepository.save(resource);
    }
}