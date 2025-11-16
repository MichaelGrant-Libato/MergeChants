package com.project.mergechants.backend.controller;

import com.project.mergechants.backend.dto.AuthResponse;
import com.project.mergechants.backend.dto.LoginRequest;
import com.project.mergechants.backend.dto.RegisterRequest;
import com.project.mergechants.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

  private final AuthService authService;

  @Autowired
  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  @PostMapping("/register")
  public ResponseEntity<String> registerUser(@RequestBody RegisterRequest registerRequest) {
    try {
      authService.registerStudent(registerRequest);
      return new ResponseEntity<>("User Registration Successful!", HttpStatus.CREATED);
    } catch (IllegalArgumentException e) {
      return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
    }
  }

  @PostMapping("/login")
  public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
    try {
      String token = authService.authenticateUser(loginRequest);
      return ResponseEntity.ok()
          .body(new AuthResponse(loginRequest.getStudentId(), token));

    } catch (IllegalArgumentException e) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .body("{\"message\": \"Invalid student ID or password.\"}");
    }
  }
}