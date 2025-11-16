package com.project.mergechants.backend.dto;

// Used to return the token and user ID upon successful login
public class AuthResponse {
  private String studentId;
  private String token;

  public AuthResponse(String studentId, String token) {
    this.studentId = studentId;
    this.token = token;
  }

  // --- Getters ---
  public String getStudentId() {
    return studentId;
  }

  public String getToken() {
    return token;
  }

  // --- Setters (optional for this simple object, but good practice) ---
  public void setStudentId(String studentId) {
    this.studentId = studentId;
  }

  public void setToken(String token) {
    this.token = token;
  }
}