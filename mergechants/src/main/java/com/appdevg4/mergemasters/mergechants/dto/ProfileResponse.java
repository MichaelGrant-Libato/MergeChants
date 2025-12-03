package com.appdevg4.mergemasters.mergechants.dto;

public class ProfileResponse {
    private Long id;
    private String studentId;
    private String fullName;
    private String email;
    private String phone;
    private String campus;
    private String bio;

    public ProfileResponse(Long id, String studentId, String fullName, String email, String phone, String campus,
            String bio) {
        this.id = id;
        this.studentId = studentId;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.campus = campus;
        this.bio = bio;
    }

    public Long getId() {
        return id;
    }

    public String getStudentId() {
        return studentId;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getCampus() {
        return campus;
    }

    public String getBio() {
        return bio;
    }
}
