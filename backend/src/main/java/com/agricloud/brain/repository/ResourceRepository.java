package com.agricloud.brain.repository;

import com.agricloud.brain.model.CloudResource;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResourceRepository
        extends JpaRepository<CloudResource, Long> {
}