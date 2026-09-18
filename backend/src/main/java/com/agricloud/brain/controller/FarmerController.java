package com.agricloud.brain.controller;

import com.agricloud.brain.model.Farmer;
import com.agricloud.brain.service.FarmerService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/farmers")
public class FarmerController {

    private final FarmerService farmerService;

    public FarmerController(
            FarmerService farmerService
    ) {
        this.farmerService = farmerService;
    }

    @GetMapping
    public List<Farmer> getFarmers() {
        return farmerService.getAllFarmers();
    }

    @GetMapping("/{id}")
    public Farmer getFarmer(
            @PathVariable Long id
    ) {
        return farmerService.getFarmer(id);
    }

    @PostMapping
    public Farmer createFarmer(
            @RequestBody Farmer farmer
    ) {
        return farmerService.saveFarmer(farmer);
    }
}