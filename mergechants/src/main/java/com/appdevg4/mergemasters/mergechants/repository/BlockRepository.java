package com.appdevg4.mergemasters.mergechants.repository;

import com.appdevg4.mergemasters.mergechants.entity.BlockEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface BlockRepository extends JpaRepository<BlockEntity, Long> {
    Optional<BlockEntity> findByBlockerIdAndBlockedId(String blockerId, String blockedId);

    boolean existsByBlockerIdAndBlockedId(String blockerId, String blockedId);

    List<BlockEntity> findByBlockerId(String blockerId);

    @Transactional
    void deleteByBlockerIdAndBlockedId(String blockerId, String blockedId);
}
