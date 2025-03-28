package com.travelmate.controller;

import com.travelmate.dto.UpdateUserRequest;
import com.travelmate.entity.User;
import com.travelmate.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        User user = userService.getByUsername(username);
        return ResponseEntity.ok(new UserProfileResponse(
                user.getUsername(),
                user.getEmail(),
                user.getRole()
        ));
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(@AuthenticationPrincipal UserDetails userDetails,
                                           @RequestBody @Valid UpdateUserRequest request) {
        String username = userDetails.getUsername();
        User updated = userService.updateUser(username, request);
        return ResponseEntity.ok(new UserProfileResponse(
                updated.getUsername(),
                updated.getEmail(),
                updated.getRole()
        ));
    }

    // DTO interno per la risposta
    record UserProfileResponse(String username, String email, String role) {}
}
