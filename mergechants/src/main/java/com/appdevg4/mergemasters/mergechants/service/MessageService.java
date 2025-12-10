package com.appdevg4.mergemasters.mergechants.service;

import com.appdevg4.mergemasters.mergechants.dto.BlockedUserDTO;
import com.appdevg4.mergemasters.mergechants.dto.ChatDTO;
import com.appdevg4.mergemasters.mergechants.dto.InboxDTO;
import com.appdevg4.mergemasters.mergechants.entity.BlockEntity;
import com.appdevg4.mergemasters.mergechants.entity.ListingsEntity;
import com.appdevg4.mergemasters.mergechants.entity.MessageEntity;
import com.appdevg4.mergemasters.mergechants.entity.ProfileEntity;
import com.appdevg4.mergemasters.mergechants.repository.BlockRepository;
import com.appdevg4.mergemasters.mergechants.repository.ListingsRepository;
import com.appdevg4.mergemasters.mergechants.repository.MessageRepository;
import com.appdevg4.mergemasters.mergechants.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final BlockRepository blockRepository;
    private final ListingsRepository listingsRepository;
    private final ProfileRepository profileRepository;

    @Autowired
    public MessageService(MessageRepository messageRepository,
                          BlockRepository blockRepository,
                          ListingsRepository listingsRepository,
                          ProfileRepository profileRepository) {
        this.messageRepository = messageRepository;
        this.blockRepository = blockRepository;
        this.listingsRepository = listingsRepository;
        this.profileRepository = profileRepository;
    }

    /* ========================= SEND MESSAGE ========================= */
    public MessageEntity sendMessage(MessageEntity message) {
        if (message.getContent() == null || message.getContent().trim().isEmpty()) {
            throw new IllegalArgumentException("Message content cannot be empty");
        }
        if (message.getSenderId() == null || message.getSenderId().isEmpty()) {
            throw new IllegalArgumentException("Sender ID cannot be null");
        }
        if (message.getReceiverId() == null || message.getReceiverId().isEmpty()) {
            throw new IllegalArgumentException("Receiver ID cannot be null");
        }

        // receiver blocked sender
        if (blockRepository.existsByBlockerIdAndBlockedId(message.getReceiverId(), message.getSenderId())) {
            throw new IllegalArgumentException("You can't reply to this conversation.");
        }
        // sender blocked receiver
        if (blockRepository.existsByBlockerIdAndBlockedId(message.getSenderId(), message.getReceiverId())) {
            throw new IllegalArgumentException("You blocked this conversation.");
        }

        message.setTimestamp(LocalDateTime.now());
        return messageRepository.save(message);
    }

    /* ========================= CHAT HISTORY ========================= */
    public ChatDTO getChatHistory(String user1, String user2, Long listingId) {
        if (user1 == null || user2 == null) {
            throw new IllegalArgumentException("User IDs cannot be null");
        }

        List<MessageEntity> allMessages = messageRepository.findChatHistory(user1, user2);

        List<MessageEntity> filtered = allMessages.stream()
                .filter(m -> {
                    if (listingId == null) {
                        return m.getListingId() == null;
                    }
                    return listingId.equals(m.getListingId());
                })
                .filter(m -> {
                    if (m.getSenderId().equals(user1) && m.isDeletedBySender()) return false;
                    if (m.getReceiverId().equals(user1) && m.isDeletedByReceiver()) return false;
                    return true;
                })
                .collect(Collectors.toList());

        boolean isBlocked = isBlockedBetween(user1, user2);
        String blockedBy = null;
        if (blockRepository.existsByBlockerIdAndBlockedId(user1, user2)) {
            blockedBy = user1;
        } else if (blockRepository.existsByBlockerIdAndBlockedId(user2, user1)) {
            blockedBy = user2;
        }

        return new ChatDTO(filtered, isBlocked, blockedBy);
    }

    // convenience overload
    public ChatDTO getChatHistory(String user1, String user2) {
        return getChatHistory(user1, user2, null);
    }

    /* ========================= DELETE CHAT (SOFT, PER CONVO) ========================= */
    @Transactional
    public void deleteChat(String deleterId, String otherUserId, Long listingId) {
        List<MessageEntity> history = messageRepository.findChatHistory(deleterId, otherUserId);

        for (MessageEntity m : history) {
            // filter by listing
            boolean matchesListing;
            if (listingId == null) {
                matchesListing = (m.getListingId() == null);
            } else {
                matchesListing = listingId.equals(m.getListingId());
            }
            if (!matchesListing) continue;

            if (m.getSenderId().equals(deleterId)) {
                m.setDeletedBySender(true);
            } else if (m.getReceiverId().equals(deleterId)) {
                m.setDeletedByReceiver(true);
            }
        }

        messageRepository.saveAll(history);
    }

    // old signature – delete all listings with that user
    @Transactional
    public void deleteChat(String deleterId, String otherUserId) {
        deleteChat(deleterId, otherUserId, null);
    }

    /* ========================= BLOCK / UNBLOCK ========================= */
    public boolean isBlockedBetween(String user1, String user2) {
        return blockRepository.existsByBlockerIdAndBlockedId(user1, user2)
                || blockRepository.existsByBlockerIdAndBlockedId(user2, user1);
    }

    public void blockUser(String blockerId, String blockedId) {
        if (blockerId == null || blockedId == null || blockerId.equals(blockedId)) {
            return;
        }
        if (blockRepository.existsByBlockerIdAndBlockedId(blockerId, blockedId)) {
            return;
        }

        BlockEntity block = new BlockEntity();
        block.setBlockerId(blockerId);
        block.setBlockedId(blockedId);
        blockRepository.save(block);
    }

    @Transactional
    public boolean unblockUser(String blockerId, String blockedId) {
        if (blockerId == null || blockedId == null
                || blockerId.isEmpty() || blockedId.isEmpty()) {
            return false;
        }

        return blockRepository.findByBlockerIdAndBlockedId(blockerId, blockedId)
                .map(block -> {
                    blockRepository.deleteByBlockerIdAndBlockedId(blockerId, blockedId);
                    return true;
                })
                .orElse(false);
    }

    /* ========================= BLOCKED LIST ========================= */
    public List<BlockedUserDTO> getBlockedUsers(String blockerId) {
        if (blockerId == null || blockerId.isEmpty()) {
            return Collections.emptyList();
        }

        List<BlockEntity> blocks = blockRepository.findByBlockerId(blockerId);
        if (blocks.isEmpty()) return Collections.emptyList();

        Set<String> blockedIds = blocks.stream()
                .map(BlockEntity::getBlockedId)
                .collect(Collectors.toSet());

        List<ProfileEntity> profiles = profileRepository
                .findByStudentIdIn(new ArrayList<>(blockedIds));

        Map<String, ProfileEntity> profileMap = profiles.stream()
                .collect(Collectors.toMap(ProfileEntity::getStudentId, p -> p));

        List<BlockedUserDTO> result = new ArrayList<>();

        for (String blockedId : blockedIds) {
            ProfileEntity p = profileMap.get(blockedId);
            String displayName = blockedId;
            String profilePic = null;

            if (p != null) {
                String fullName = p.getFullName() != null ? p.getFullName().trim() : "";
                if (!fullName.isEmpty()) {
                    String[] parts = fullName.split("\\s+");
                    String lastName = parts[parts.length - 1];
                    displayName = lastName + "(" + blockedId + ")";
                }
                profilePic = p.getProfilePic();
            }

            result.add(new BlockedUserDTO(blockedId, displayName, profilePic));
        }

        result.sort((a, b) -> a.getDisplayName().compareToIgnoreCase(b.getDisplayName()));
        return result;
    }

    /* ========================= INBOX ========================= */
    public List<InboxDTO> generateInbox(String userId) {
        if (userId == null || userId.isEmpty()) {
            return Collections.emptyList();
        }

        List<MessageEntity> rawMessages =
                messageRepository.findBySenderIdOrReceiverId(userId, userId);

        Map<String, MessageEntity> latestMessages = new HashMap<>();

        for (MessageEntity m : rawMessages) {
            // skip messages the current user soft-deleted
            if (m.getSenderId().equals(userId) && m.isDeletedBySender()) continue;
            if (m.getReceiverId().equals(userId) && m.isDeletedByReceiver()) continue;

            String other = m.getSenderId().equals(userId)
                    ? m.getReceiverId()
                    : m.getSenderId();

            Long lid = m.getListingId();
            String key = other + "_" + (lid == null ? "NULL" : lid);

            MessageEntity currentBest = latestMessages.get(key);
            if (currentBest == null || m.getTimestamp().isAfter(currentBest.getTimestamp())) {
                latestMessages.put(key, m);
            }
        }

        List<InboxDTO> inbox = new ArrayList<>();

        Set<Long> listingIds = new HashSet<>();
        Set<String> otherUserIds = new HashSet<>();

        for (MessageEntity m : latestMessages.values()) {
            if (m.getListingId() != null) listingIds.add(m.getListingId());
            String other = m.getSenderId().equals(userId) ? m.getReceiverId() : m.getSenderId();
            otherUserIds.add(other);
        }

        List<ListingsEntity> listings = listingsRepository.findAllById(listingIds);
        Map<Long, ListingsEntity> listingMap = listings.stream()
                .collect(Collectors.toMap(ListingsEntity::getId, l -> l));

        List<ProfileEntity> profiles =
                profileRepository.findByStudentIdIn(new ArrayList<>(otherUserIds));
        Map<String, ProfileEntity> profileMap = profiles.stream()
                .collect(Collectors.toMap(ProfileEntity::getStudentId, p -> p));

        for (MessageEntity m : latestMessages.values()) {
            String otherId = m.getSenderId().equals(userId) ? m.getReceiverId() : m.getSenderId();

            String displayName = otherId;
            ProfileEntity p = profileMap.get(otherId);
            if (p != null && p.getFullName() != null && !p.getFullName().trim().isEmpty()) {
                String[] parts = p.getFullName().trim().split("\\s+");
                String lastName = parts[parts.length - 1];
                displayName = lastName + "(" + otherId + ")";
            }

            Long lid = m.getListingId();
            String lName = "General Chat";
            String lImage = null;

            if (lid != null) {
                ListingsEntity l = listingMap.get(lid);
                if (l != null) {
                    lName = l.getName();

                    String allImages = l.getImages();
                    if (allImages != null && !allImages.isEmpty()) {
                        String[] parts = allImages.split(",");
                        if (parts.length > 0) {
                            String first = parts[0].trim();
                            if (!first.isEmpty()) {
                                // only first image – frontend will convert to URL
                                lImage = first;
                            }
                        }
                    }
                }
            }

            inbox.add(new InboxDTO(
                    otherId,
                    displayName,
                    m.getContent(),
                    m.getTimestamp(),
                    lid,
                    lName,
                    lImage
            ));
        }

        inbox.sort((a, b) -> b.getTime().compareTo(a.getTime()));
        return inbox;
    }
}
