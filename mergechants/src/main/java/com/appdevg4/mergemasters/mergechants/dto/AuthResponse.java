package com.appdevg4.mergemasters.mergechants.dto;

public class AuthResponse {
  private String studentId;
  private String token;

  public AuthResponse(String studentId, String token) {
    this.studentId = studentId;
    this.token = token;
  }

  //Getters
  public String getStudentId() {
    return studentId;
  }

  public String getToken() {
    return token;
  }

  // Setters
  public void setStudentId(String studentId) {
    this.studentId = studentId;
  }

  public void setToken(String token) {
    this.token = token;
  }
}