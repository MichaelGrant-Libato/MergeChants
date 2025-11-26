package com.project.mergechants.backend.repository;

import com.project.mergechants.backend.entity.EscrowEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EscrowRepository extends JpaRepository<EscrowEntity, Long> {
    List<EscrowEntity> findByBuyerId(String buyerId);
}
