package com.appdevg4.mergemasters.mergechants.repository;

import com.appdevg4.mergemasters.mergechants.entity.ProfileEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfileRepository extends JpaRepository<ProfileEntity, Long> {
    boolean existsByStudentId(String studentId);

    Optional<ProfileEntity> findByStudentId(String studentId);

    // email is optional; keep these only if you still want them
    boolean existsByEmail(String email);

    Optional<ProfileEntity> findByEmail(String email);
}
