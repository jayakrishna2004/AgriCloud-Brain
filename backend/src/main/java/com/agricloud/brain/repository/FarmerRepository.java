package com.agricloud.brain.repository;

import com.agricloud.brain.model.Farmer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FarmerRepository
        extends JpaRepository<Farmer, Long> {
}