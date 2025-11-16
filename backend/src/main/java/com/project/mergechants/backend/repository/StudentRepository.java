package com.project.mergechants.backend.repository;

import com.project.mergechants.backend.entity.StudentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<StudentEntity, String> {
  boolean existsByStudentNumber(String studentNumber);

  Optional<StudentEntity> findByStudentNumber(String studentNumber);
}