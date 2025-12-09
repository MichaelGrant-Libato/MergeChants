package com.appdevg4.mergemasters.mergechants.repository;

import com.appdevg4.mergemasters.mergechants.entity.StudentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<StudentEntity, String> {

    boolean existsByStudentNumber(String studentNumber);

    boolean existsByOutlookEmail(String outlookEmail);

    Optional<StudentEntity> findByStudentNumber(String studentNumber);

    Optional<StudentEntity> findByOutlookEmail(String outlookEmail);

    Optional<StudentEntity> findByStudentNumberOrOutlookEmail(String studentNumber, String outlookEmail);
}
