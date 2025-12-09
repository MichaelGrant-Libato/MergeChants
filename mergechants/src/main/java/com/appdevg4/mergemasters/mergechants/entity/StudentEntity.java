package com.appdevg4.mergemasters.mergechants.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "students")
public class StudentEntity {

    @Id
    @Column(name = "student_number")
    private String studentNumber;

    @Column(name = "cit_email", nullable = false, unique = true)
    private String outlookEmail;  // your CIT Outlook email

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "middle_initial")
    private String middleInitial;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "year_level")
    private String yearLevel;

    @Column(name = "course")
    private String course;

    @Column(name = "password")
    private String password;

    public StudentEntity() {}

    public String getStudentNumber() { return studentNumber; }
    public String getOutlookEmail() { return outlookEmail; }
    public String getFirstName() { return firstName; }
    public String getMiddleInitial() { return middleInitial; }
    public String getLastName() { return lastName; }
    public String getYearLevel() { return yearLevel; }
    public String getCourse() { return course; }
    public String getPassword() { return password; }

    public void setStudentNumber(String studentNumber) { this.studentNumber = studentNumber; }
    public void setOutlookEmail(String outlookEmail) { this.outlookEmail = outlookEmail; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public void setMiddleInitial(String middleInitial) { this.middleInitial = middleInitial; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public void setYearLevel(String yearLevel) { this.yearLevel = yearLevel; }
    public void setCourse(String course) { this.course = course; }
    public void setPassword(String password) { this.password = password; }
}
