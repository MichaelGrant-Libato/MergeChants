package com.appdevg4.mergemasters.mergechants.dto;

public class RegisterRequest {

  private String studentNumber;
  private String outlookEmail; // NEW FIELD
  private String firstName;
  private String middleInitial;
  private String lastName;
  private String yearLevel;
  private String course;
  private String password;

  public RegisterRequest() {}

  // Getters
  public String getStudentNumber() { return studentNumber; }
  public String getOutlookEmail() { return outlookEmail; }
  public String getFirstName() { return firstName; }
  public String getMiddleInitial() { return middleInitial; }
  public String getLastName() { return lastName; }
  public String getYearLevel() { return yearLevel; }
  public String getCourse() { return course; }
  public String getPassword() { return password; }

  // Setters
  public void setStudentNumber(String studentNumber) { this.studentNumber = studentNumber; }
  public void setOutlookEmail(String outlookEmail) { this.outlookEmail = outlookEmail; }
  public void setFirstName(String firstName) { this.firstName = firstName; }
  public void setMiddleInitial(String middleInitial) { this.middleInitial = middleInitial; }
  public void setLastName(String lastName) { this.lastName = lastName; }
  public void setYearLevel(String yearLevel) { this.yearLevel = yearLevel; }
  public void setCourse(String course) { this.course = course; }
  public void setPassword(String password) { this.password = password; }
}
