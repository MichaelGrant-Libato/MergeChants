package com.appdevg4.mergemasters.mergechants.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ProfileRequest {

    @NotBlank(message = "fullName is required")
    @Size(max = 255, message = "fullName must be at most 255 characters")
    private String fullName;

    @NotBlank(message = "email is required")
    @Email(message = "email must be valid")
    @Size(max = 255, message = "email must be at most 255 characters")
    private String email;

    @Size(max = 50, message = "phone must be at most 50 characters")
    private String phone;

    @Size(max = 100, message = "campus must be at most 100 characters")
    private String campus;

    @Size(max = 2000, message = "bio must be at most 2000 characters")
    private String bio;

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getCampus() {
        return campus;
    }

    public void setCampus(String campus) {
        this.campus = campus;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }
}
