package com.appdevg4.mergemasters.mergechants.controller;

import com.appdevg4.mergemasters.mergechants.entity.StudentEntity;
import com.appdevg4.mergemasters.mergechants.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:3000")
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    
    @GetMapping("/{studentNumber}")
    public ResponseEntity<StudentEntity> getStudent(@PathVariable String studentNumber) {
        return studentRepository.findById(studentNumber)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<StudentEntity> getByEmail(@PathVariable String email) {
        return studentRepository.findByOutlookEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}