// backend/src/main/java/com/project/mergechants/backend/controller/request/LoginRequest.java
package com.project.mergechants.backend.controller.request;

import jakarta.validation.constraints.NotBlank;

public class LoginRequest {

    // Matches the 'studentId' field from the frontend
    @NotBlank(message = "Student ID cannot be empty")
    private String studentId; 

    // Matches the 'password' field from the frontend
    @NotBlank(message = "Password cannot be empty")
    private String password;

    // Default constructor (required by some frameworks/libraries)
    public LoginRequest() {}

    // Constructor for convenience
    public LoginRequest(String studentId, String password) {
        this.studentId = studentId;
        this.password = password;
    }
    
    // --- Getters ---

    public String getStudentId() {
        return studentId;
    }

    public String getPassword() {
        return password;
    }
    
    // --- Setters ---

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}