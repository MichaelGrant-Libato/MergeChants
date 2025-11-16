package com.project.mergechants.backend.dto;

public class LoginRequest {
  private String studentId; // Matches the name used in the frontend fetch body
  private String password;

  public LoginRequest() {
    // Default constructor
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