package com.project.mergechants.backend.controller;

import com.project.mergechants.backend.entity.StudentEntity;
import com.project.mergechants.backend.repository.StudentRepository;
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
}