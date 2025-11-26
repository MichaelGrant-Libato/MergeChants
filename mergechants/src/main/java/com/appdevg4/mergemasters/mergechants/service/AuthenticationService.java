package com.appdevg4.mergemasters.mergechants.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    private final AuthenticationManager authenticationManager;

    public AuthenticationService(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    public LoginResponse authenticateUser(String studentId, String password) {
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(studentId, password);

        try {
            Authentication authentication = authenticationManager.authenticate(authToken);
            
            String token = "MOCK_JWT_TOKEN_FOR_" + studentId + "_SUCCESS";
            String firstName = authentication.getName();

            return new LoginResponse(token, firstName);

        } catch (AuthenticationException e) {
            System.err.println("Authentication failed for ID " + studentId + ": " + e.getMessage());
            throw new RuntimeException("Invalid Student ID or password.");
        }
    }

    public static class LoginResponse {
        private String token;
        private String firstName;

        public LoginResponse(String token, String firstName) {
            this.token = token;
            this.firstName = firstName;
        }

        public String getToken() {
            return token;
        }

        public String getFirstName() {
            return firstName;
        }
    }
}