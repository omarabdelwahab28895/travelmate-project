package com.travelmate.service;

import com.travelmate.dto.LoginRequest;
import com.travelmate.dto.RegisterRequest;
import com.travelmate.dto.AuthResponse;
import com.travelmate.entity.User;
import com.travelmate.repository.UserRepository;
import com.travelmate.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthResponse register(RegisterRequest request) {
        System.out.println("🚀 [AuthService] Richiesta di registrazione per utente: " + request.getUsername());

        if (userRepository.existsByUsername(request.getUsername()) || userRepository.existsByEmail(request.getEmail())) {
            System.out.println("⚠️ [AuthService] Utente già esistente");
            throw new RuntimeException("Utente già esistente");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role("USER")
                .build();

        userRepository.save(user);
        System.out.println("✅ [AuthService] Utente salvato: " + user.getUsername());

        String token = jwtUtils.generateToken(user.getUsername());
        System.out.println("🔑 [AuthService] Token generato: " + token);

        return new AuthResponse(token);
    }

    public AuthResponse login(LoginRequest request) {
        System.out.println("🔐 [AuthService] Tentativo di login per utente: " + request.getUsername());

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> {
                    System.out.println("❌ [AuthService] Utente non trovato: " + request.getUsername());
                    return new RuntimeException("Utente non trovato");
                });

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            System.out.println("❌ [AuthService] Password errata per utente: " + request.getUsername());
            throw new RuntimeException("Password errata");
        }

        String token = jwtUtils.generateToken(user.getUsername());
        System.out.println("✅ [AuthService] Login riuscito, token: " + token);

        return new AuthResponse(token);
    }
}
