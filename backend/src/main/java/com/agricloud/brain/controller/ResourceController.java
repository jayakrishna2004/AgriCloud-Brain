package com.agricloud.brain.controller;

import com.agricloud.brain.dto.ResourceResponse;
import com.agricloud.brain.model.CloudResource;
import com.agricloud.brain.service.ResourceService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
public class ResourceController {

    private final ResourceService resourceService;

    public ResourceController(
            ResourceService resourceService
    ) {
        this.resourceService =
                resourceService;
    }

    @GetMapping
    public List<ResourceResponse> getResources() {

        return resourceService.getResources();
    }

    @PostMapping
    public CloudResource createResource(
            @RequestBody CloudResource resource
    ) {

        return resourceService.save(resource);
    }
}