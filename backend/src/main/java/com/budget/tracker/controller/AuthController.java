package com.budget.tracker.controller;

import com.budget.tracker.dto.AuthRequest;
import com.budget.tracker.dto.AuthResponse;
import com.budget.tracker.dto.RegisterRequest;
import com.budget.tracker.model.User;
import com.budget.tracker.repository.UserRepository;
import com.budget.tracker.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Objects;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepo, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        if (userRepo.existsByEmail(req.email())) {
            return ResponseEntity.badRequest().body("Email already in use");
        }
        User user = User.builder()
            .name(req.name())
            .email(req.email())
            .password(passwordEncoder.encode(req.password()))
            .build();
        user = Objects.requireNonNull(userRepo.save(user));
        String token = jwtUtil.generateToken(user.getEmail(), user.getId());
        return ResponseEntity.ok(new AuthResponse(token, user.getId(), user.getName(), user.getEmail()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest req) {
        return userRepo.findByEmail(req.email())
            .filter(u -> passwordEncoder.matches(req.password(), u.getPassword()))
            .map(u -> {
                String token = jwtUtil.generateToken(u.getEmail(), u.getId());
                return ResponseEntity.ok(new AuthResponse(token, u.getId(), u.getName(), u.getEmail()));
            })
            .orElse(ResponseEntity.status(401).build());
    }
}
