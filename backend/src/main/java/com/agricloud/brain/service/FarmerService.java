package com.agricloud.brain.service;

import com.agricloud.brain.model.Farmer;
import com.agricloud.brain.repository.FarmerRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FarmerService {

    private final FarmerRepository farmerRepository;

    public FarmerService(
            FarmerRepository farmerRepository
    ) {
        this.farmerRepository = farmerRepository;
    }

    public List<Farmer> getAllFarmers() {
        return farmerRepository.findAll();
    }

    public Farmer getFarmer(Long id) {

        return farmerRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Farmer not found"
                        )
                );
    }

    public Farmer saveFarmer(Farmer farmer) {
        return farmerRepository.save(farmer);
    }
}