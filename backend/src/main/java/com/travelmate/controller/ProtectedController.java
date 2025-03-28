package com.travelmate.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/protected")
public class ProtectedController {

    @GetMapping("/hello")
    public ResponseEntity<String> hello() {
        return ResponseEntity.ok("🔐 Accesso autorizzato! Benvenuto nell'area protetta.");
    }
}
