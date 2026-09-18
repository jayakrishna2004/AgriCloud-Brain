package com.agricloud.brain.service;

import com.agricloud.brain.dto.LoginRequest;
import com.agricloud.brain.dto.LoginResponse;
import com.agricloud.brain.model.User;
import com.agricloud.brain.repository.UserRepository;
import com.agricloud.brain.security.JwtService;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password")
                );

        if (!passwordEncoder.matches(
        request.getPassword(),
        user.getPassword()
)) {
    throw new RuntimeException("Invalid email or password");
}

if (request.getRole() != null &&
        !request.getRole().equalsIgnoreCase(user.getRole())) {

    throw new RuntimeException(
            "Selected role does not match this account"
    );
}

        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole()
        );

        return new LoginResponse(
                token,
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }

    public User register(User user) {

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException(
                    "Email already registered"
            );
        }

        user.setPassword(
                passwordEncoder.encode(user.getPassword())
        );

        if (user.getRole() == null ||
                user.getRole().isBlank()) {

            user.setRole("FARMER");
        }

        return userRepository.save(user);
    }
}