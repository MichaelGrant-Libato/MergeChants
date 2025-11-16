package com.project.mergechants.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "students")
public class StudentEntity {

  @Id
  private String studentNumber;

  private String firstName;
  private String middleInitial;
  private String lastName;
  private String yearLevel;
  private String course;
  private String password;

  public StudentEntity() {
  }

  // --- Getters ---
  public String getStudentNumber() {
    return studentNumber;
  }

  public String getFirstName() {
    return firstName;
  }

  public String getMiddleInitial() {
    return middleInitial;
  }

  public String getLastName() {
    return lastName;
  }

  public String getYearLevel() {
    return yearLevel;
  }

  public String getCourse() {
    return course;
  }

  public String getPassword() {
    return password;
  }

  // --- Setters ---
  public void setStudentNumber(String studentNumber) {
    this.studentNumber = studentNumber;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public void setMiddleInitial(String middleInitial) {
    this.middleInitial = middleInitial;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public void setYearLevel(String yearLevel) {
    this.yearLevel = yearLevel;
  }

  public void setCourse(String course) {
    this.course = course;
  }

  public void setPassword(String password) {
    this.password = password;
  }
}