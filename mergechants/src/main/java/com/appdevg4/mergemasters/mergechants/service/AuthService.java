package com.appdevg4.mergemasters.mergechants.service;

import com.appdevg4.mergemasters.mergechants.dto.LoginRequest;
import com.appdevg4.mergemasters.mergechants.dto.RegisterRequest;
import com.appdevg4.mergemasters.mergechants.entity.StudentEntity;
import com.appdevg4.mergemasters.mergechants.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthService(StudentRepository studentRepository,
                       PasswordEncoder passwordEncoder) {
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void registerStudent(RegisterRequest request) {

        if (studentRepository.existsByStudentNumber(request.getStudentNumber())) {
            throw new IllegalArgumentException(
                    "Student ID " + request.getStudentNumber() + " is already registered.");
        }

        if (studentRepository.existsByOutlookEmail(request.getOutlookEmail().toLowerCase())) {
            throw new IllegalArgumentException(
                    "Outlook email " + request.getOutlookEmail() + " is already registered.");
        }

        StudentEntity student = new StudentEntity();
        student.setStudentNumber(request.getStudentNumber());
        student.setOutlookEmail(request.getOutlookEmail().toLowerCase());
        student.setFirstName(request.getFirstName());
        student.setMiddleInitial(request.getMiddleInitial());
        student.setLastName(request.getLastName());
        student.setYearLevel(request.getYearLevel());
        student.setCourse(request.getCourse());
        student.setPassword(passwordEncoder.encode(request.getPassword()));

        studentRepository.save(student);
    }

    public String authenticateUser(LoginRequest request) {
        String credential = request.getCredential();
        if (credential == null || credential.trim().isEmpty()) {
            throw new IllegalArgumentException("Credential is required.");
        }

        credential = credential.trim();

        boolean isEmail = credential.contains("@");

        Optional<StudentEntity> studentOptional = isEmail
                ? studentRepository.findByOutlookEmail(credential.toLowerCase())
                : studentRepository.findByStudentNumber(credential);

        if (studentOptional.isEmpty()) {
            throw new IllegalArgumentException("Invalid ID/email or password.");
        }

        StudentEntity student = studentOptional.get();

        if (!passwordEncoder.matches(request.getPassword(), student.getPassword())) {
            throw new IllegalArgumentException("Invalid ID/email or password.");
        }

        return "JWT_TOKEN_ISSUED_TO_" + student.getStudentNumber();
    }
}
