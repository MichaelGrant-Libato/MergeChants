package com.appdevg4.mergemasters.mergechants.repository;

import com.appdevg4.mergemasters.mergechants.entity.BlockEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface BlockRepository extends JpaRepository<BlockEntity, Long> {
    Optional<BlockEntity> findByBlockerIdAndBlockedId(String blockerId, String blockedId);

    boolean existsByBlockerIdAndBlockedId(String blockerId, String blockedId);
}
