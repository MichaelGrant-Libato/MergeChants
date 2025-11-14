// backend/src/main/java/com/project/mergechants/backend/controller/AuthController.java
package com.project.mergechants.backend.controller;

import com.project.mergechants.backend.controller.request.LoginRequest;
import com.project.mergechants.backend.service.AuthenticationService; 
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth") // Base URL: http://localhost:8080/api/auth
public class AuthController {

    private final AuthenticationService authService;

    
    public AuthController(AuthenticationService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Object loginResponse = authService.authenticateUser(
                loginRequest.getStudentId(), 
                loginRequest.getPassword()
            );
            
            
            return ResponseEntity.ok(loginResponse);
            
        } catch (RuntimeException e) {
            return ResponseEntity
                .status(401)
                .body(e.getMessage());
        }
    }
    
  
}