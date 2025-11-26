package com.project.mergechants.backend.repository;

import com.project.mergechants.backend.entity.ProfileEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfileRepository extends JpaRepository<ProfileEntity, Long> {
    Optional<ProfileEntity> findByEmail(String email);

    boolean existsByEmail(String email);
}
