package com.appdevg4.mergemasters.mergechants.service;

import com.appdevg4.mergemasters.mergechants.entity.BlockEntity;
import com.appdevg4.mergemasters.mergechants.repository.BlockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BlockService {

    private final BlockRepository blockRepository;

    public boolean isBlockedBetween(String userA, String userB) {
        return blockRepository.existsByBlockerIdAndBlockedId(userA, userB)
                || blockRepository.existsByBlockerIdAndBlockedId(userB, userA);
    }

    public String getBlockerBetween(String userA, String userB) {
        if (blockRepository.existsByBlockerIdAndBlockedId(userA, userB)) return userA;
        if (blockRepository.existsByBlockerIdAndBlockedId(userB, userA)) return userB;
        return null;
    }

    public void blockUser(String blockerId, String blockedId) {
        if (!blockRepository.existsByBlockerIdAndBlockedId(blockerId, blockedId)) {
            BlockEntity entity = new BlockEntity(null, blockerId, blockedId);
            blockRepository.save(entity);
        }
    }

    public void unblockUser(String blockerId, String blockedId) {
        blockRepository.deleteByBlockerIdAndBlockedId(blockerId, blockedId);
        blockRepository.deleteByBlockerIdAndBlockedId(blockedId, blockerId);
    }
}
