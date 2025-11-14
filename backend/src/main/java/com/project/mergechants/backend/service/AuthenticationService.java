// backend/src/main/java/com/project/mergechants/backend/service/AuthenticationService.java
package com.project.mergechants.backend.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    // 💡 Inject the AuthenticationManager bean defined in SecurityConfig
    private final AuthenticationManager authenticationManager;

    // 💡 Constructor Injection for the AuthenticationManager
    public AuthenticationService(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    /**
     * Authenticates the user using Spring Security's AuthenticationManager.
     * @param studentId The student ID (used as the username).
     * @param password The raw password.
     * @return A DTO containing the JWT token and user details on success.
     * @throws RuntimeException if authentication fails.
     */
    public LoginResponse authenticateUser(String studentId, String password) {
        
        // 1. Create a token object containing the user's credentials
        UsernamePasswordAuthenticationToken authToken = 
            new UsernamePasswordAuthenticationToken(studentId, password);
        
        try {
            // 2. Attempt authentication
            // This method delegates to the UserDetailsService (which you still need to define)
            // andPasswordEncoder for hash checking.
            Authentication authentication = authenticationManager.authenticate(authToken);

            // If execution reaches here, authentication was successful.
            
            // 3. Generate and return a token
            // TODO: Replace this mock implementation with actual JWT token generation logic
            String token = "MOCK_JWT_TOKEN_FOR_" + studentId + "_SUCCESS";
            
            // Get user's first name from the Authentication object's Principal (future step)
            String firstName = authentication.getName(); // Currently returns the studentId/username
            
            return new LoginResponse(token, firstName); 
            
        } catch (AuthenticationException e) {
            // Catches exceptions like BadCredentialsException
            System.err.println("Authentication failed for ID " + studentId + ": " + e.getMessage());
            // 4. Throw a RuntimeException that the AuthController will catch and map to 401
            throw new RuntimeException("Invalid Student ID or password.");
        }
    }
    
    // --- Response DTO (Matches what the frontend expects) ---
    public static class LoginResponse {
        // Must be public or have getters for Jackson (JSON) serialization
        private String token;
        private String firstName;
        
        public LoginResponse(String token, String firstName) {
            this.token = token;
            this.firstName = firstName;
        }

        // Getters are crucial for Jackson to serialize the object into JSON
        public String getToken() { return token; }
        public String getFirstName() { return firstName; }
        
        // You might need setters if you use a library that requires them, but often not for DTOs
    }
}