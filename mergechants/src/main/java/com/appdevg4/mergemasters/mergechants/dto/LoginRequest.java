package com.appdevg4.mergemasters.mergechants.dto;

public class LoginRequest {
  private String studentId; 
  private String password;

  public LoginRequest() {
  }

  //Getters 
  public String getStudentId() {
    return studentId;
  }

  public String getPassword() {
    return password;
  }

  //Setters 
  public void setStudentId(String studentId) {
    this.studentId = studentId;
  }

  public void setPassword(String password) {
    this.password = password;
  }
}