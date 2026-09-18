package com.agricloud.brain.config;

import com.agricloud.brain.model.CloudResource;
import com.agricloud.brain.model.User;
import com.agricloud.brain.repository.ResourceRepository;
import com.agricloud.brain.repository.UserRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initializeData(
            UserRepository userRepository,
            ResourceRepository resourceRepository,
            PasswordEncoder passwordEncoder
    ) {

        return args -> {

            // =========================
            // FARMER USER
            // =========================

            if (!userRepository.existsByEmail(
                    "farmer@gmail.com")) {

                User farmer = new User(
                        "Demo Farmer",
                        "farmer@gmail.com",
                        passwordEncoder.encode("123456"),
                        "FARMER"
                );

                userRepository.save(farmer);
            }

            // =========================
            // ADMIN USER
            // =========================

            if (!userRepository.existsByEmail(
                    "admin@gmail.com")) {

                User admin = new User(
                        "System Administrator",
                        "admin@gmail.com",
                        passwordEncoder.encode("123456"),
                        "ADMIN"
                );

                userRepository.save(admin);
            }

            // =========================
            // CLOUD RESOURCES
            // =========================

            if (resourceRepository.count() == 0) {

                resourceRepository.save(
                        new CloudResource(
                                "Spring Boot Backend",
                                "healthy",
                                61,
                                58,
                                4
                        )
                );

                resourceRepository.save(
                        new CloudResource(
                                "AI Prediction Engine",
                                "healthy",
                                73,
                                65,
                                3
                        )
                );

                resourceRepository.save(
                        new CloudResource(
                                "React Frontend",
                                "healthy",
                                35,
                                42,
                                2
                        )
                );
            }

            System.out.println(
                    "========================================"
            );

            System.out.println(
                    "AgriCloud-Brain demo data initialized"
            );

            System.out.println(
                    "Farmer: farmer@gmail.com / 123456"
            );

            System.out.println(
                    "Admin : admin@gmail.com / 123456"
            );

            System.out.println(
                    "========================================"
            );
        };
    }
}