// src/main/java/com/appdevg4/mergemasters/mergechants/repository/TransactionRepository.java
package com.appdevg4.mergemasters.mergechants.repository;

import com.appdevg4.mergemasters.mergechants.entity.TransactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<TransactionEntity, Long> {

    List<TransactionEntity> findByBuyerIdOrSellerIdOrderByCompletedAtDesc(
            String buyerId,
            String sellerId
    );
}
