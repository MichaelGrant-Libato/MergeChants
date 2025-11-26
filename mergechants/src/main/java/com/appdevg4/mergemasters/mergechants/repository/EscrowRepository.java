package com.appdevg4.mergemasters.mergechants.repository;

import com.appdevg4.mergemasters.mergechants.entity.EscrowEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EscrowRepository extends JpaRepository<EscrowEntity, Long> {
    List<EscrowEntity> findByBuyerId(String buyerId);
}
