package com.appdevg4.mergemasters.mergechants.dto;

public class LoginRequest {

    private String credential; // student ID or email
    private String password;

    public LoginRequest() {}

    public String getCredential() { return credential; }
    public String getPassword() { return password; }

    public void setCredential(String credential) { this.credential = credential; }
    public void setPassword(String password) { this.password = password; }
}
