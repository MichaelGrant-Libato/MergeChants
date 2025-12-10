package com.appdevg4.mergemasters.mergechants.service;

import com.appdevg4.mergemasters.mergechants.entity.BlockEntity;
import com.appdevg4.mergemasters.mergechants.entity.MessageEntity;
import com.appdevg4.mergemasters.mergechants.repository.BlockRepository;
import com.appdevg4.mergemasters.mergechants.repository.ListingsRepository;
import com.appdevg4.mergemasters.mergechants.repository.MessageRepository;
import com.appdevg4.mergemasters.mergechants.dto.ChatDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Objects;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.Set;
import java.util.Map;
import java.util.Collections;

@Service
public class MessageService {

    private final MessageRepository messageRepository;

    private final BlockRepository blockRepository;

    private final ListingsRepository listingsRepository;
    private final com.appdevg4.mergemasters.mergechants.repository.ProfileRepository profileRepository;

    @Autowired
    public MessageService(MessageRepository messageRepository, BlockRepository blockRepository,
            ListingsRepository listingsRepository,
            com.appdevg4.mergemasters.mergechants.repository.ProfileRepository profileRepository) {
        this.messageRepository = messageRepository;
        this.blockRepository = blockRepository;
        this.listingsRepository = listingsRepository;
        this.profileRepository = profileRepository;
    }

    public MessageEntity sendMessage(MessageEntity message) {
        // check block status
        if (blockRepository.existsByBlockerIdAndBlockedId(message.getSenderId(), message.getReceiverId())) {
            throw new IllegalArgumentException("You are blocked by this user");
        }
        if (blockRepository.existsByBlockerIdAndBlockedId(message.getReceiverId(), message.getSenderId())) {
            throw new IllegalArgumentException("You blocked this conversation");
        }

        message.setTimestamp(LocalDateTime.now());

        if (message.getContent() == null || message.getContent().trim().isEmpty()) {
            throw new IllegalArgumentException("Message content cannot be empty");
        }

        if (message.getSenderId() == null || message.getSenderId().isEmpty()) {
            throw new IllegalArgumentException("Sender ID cannot be null");
        }
        if (message.getReceiverId() == null || message.getReceiverId().isEmpty()) {
            throw new IllegalArgumentException("Receiver ID cannot be null");
        }

        return messageRepository.save(message);
    }

    public ChatDTO getChatHistory(String user1, String user2, Long listingId) {
        if (user1 == null || user2 == null) {
            throw new IllegalArgumentException("User IDs cannot be null");
        }

        // Find ALL messages between users
        List<MessageEntity> allMessages = messageRepository.findChatHistory(user1, user2);

        // Filter by listing ID if provided (treat null listingId as "General" or match
        // nulls)
        List<MessageEntity> filtered = allMessages.stream()
                .filter(m -> {
                    if (listingId == null)
                        return m.getListingId() == null;
                    return listingId.equals(m.getListingId());
                })
                // Filter deleted
                .filter(m -> {
                    if (m.getSenderId().equals(user1) && m.isDeletedBySender())
                        return false;
                    if (m.getReceiverId().equals(user1) && m.isDeletedByReceiver())
                        return false;
                    return true;
                })
                .collect(java.util.stream.Collectors.toList());

        boolean isBlocked = blockRepository.existsByBlockerIdAndBlockedId(user2, user1) ||
                blockRepository.existsByBlockerIdAndBlockedId(user1, user2);

        String blockedBy = null;
        if (blockRepository.existsByBlockerIdAndBlockedId(user2, user1)) {
            blockedBy = user2;
        } else if (blockRepository.existsByBlockerIdAndBlockedId(user1, user2)) {
            blockedBy = user1;
        }

        return new ChatDTO(filtered, isBlocked, blockedBy);
    }

    // Kept for backward compatibility if needed, or overloaded
    public ChatDTO getChatHistory(String user1, String user2) {
        return getChatHistory(user1, user2, null);
    }

    @Transactional
    public void deleteChat(String deleterId, String otherUserId) {
        // 1. Soft delete messages
        List<MessageEntity> history = messageRepository.findChatHistory(deleterId, otherUserId);
        for (MessageEntity m : history) {
            if (m.getSenderId().equals(deleterId)) {
                m.setDeletedBySender(true);
            } else if (m.getReceiverId().equals(deleterId)) {
                m.setDeletedByReceiver(true);
            }
        }
        messageRepository.saveAll(history);

        // 2. Block user if not already blocked
        if (!blockRepository.existsByBlockerIdAndBlockedId(deleterId, otherUserId)) {
            BlockEntity block = new BlockEntity();
            block.setBlockerId(deleterId);
            block.setBlockedId(otherUserId);
            blockRepository.save(block);
        }
    }

    public List<MessageEntity> getUserInbox(String userId) {
        if (userId == null || userId.isEmpty()) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        return messageRepository.findBySenderIdOrReceiverId(userId, userId);
    }

    public List<com.appdevg4.mergemasters.mergechants.dto.InboxDTO> generateInbox(String userId) {
        if (userId == null || userId.isEmpty())
            return java.util.Collections.emptyList();

        List<MessageEntity> rawMessages = messageRepository.findBySenderIdOrReceiverId(userId, userId);

        // Group by OtherUser + ListingID
        java.util.Map<String, MessageEntity> latestMessages = new java.util.HashMap<>();

        for (MessageEntity m : rawMessages) {
            // Check delete flags
            if (m.getSenderId().equals(userId) && m.isDeletedBySender())
                continue;
            if (m.getReceiverId().equals(userId) && m.isDeletedByReceiver())
                continue;

            String other = m.getSenderId().equals(userId) ? m.getReceiverId() : m.getSenderId();
            Long lid = m.getListingId();
            String key = other + "_" + (lid == null ? "NULL" : lid);

            MessageEntity currentBest = latestMessages.get(key);
            if (currentBest == null || m.getTimestamp().isAfter(currentBest.getTimestamp())) {
                latestMessages.put(key, m);
            }
        }

        List<com.appdevg4.mergemasters.mergechants.dto.InboxDTO> inbox = new java.util.ArrayList<>();

        // Collect IDs for batch fetching
        java.util.Set<Long> listingIds = new java.util.HashSet<>();
        java.util.Set<String> otherUserIds = new java.util.HashSet<>();

        for (MessageEntity m : latestMessages.values()) {
            if (m.getListingId() != null)
                listingIds.add(m.getListingId());
            String other = m.getSenderId().equals(userId) ? m.getReceiverId() : m.getSenderId();
            otherUserIds.add(other);
        }

        List<com.appdevg4.mergemasters.mergechants.entity.ListingsEntity> listings = listingsRepository
                .findAllById(listingIds);
        java.util.Map<Long, com.appdevg4.mergemasters.mergechants.entity.ListingsEntity> listingMap = listings.stream()
                .collect(java.util.stream.Collectors
                        .toMap(com.appdevg4.mergemasters.mergechants.entity.ListingsEntity::getId, l -> l));

        List<com.appdevg4.mergemasters.mergechants.entity.ProfileEntity> profiles = profileRepository
                .findByStudentIdIn(new java.util.ArrayList<>(otherUserIds));
        java.util.Map<String, com.appdevg4.mergemasters.mergechants.entity.ProfileEntity> profileMap = profiles.stream()
                .collect(java.util.stream.Collectors
                        .toMap(com.appdevg4.mergemasters.mergechants.entity.ProfileEntity::getStudentId, p -> p));

        for (MessageEntity m : latestMessages.values()) {
            String otherId = m.getSenderId().equals(userId) ? m.getReceiverId() : m.getSenderId();

            // Format Name: LastName(ID)
            String displayName = otherId;
            com.appdevg4.mergemasters.mergechants.entity.ProfileEntity p = profileMap.get(otherId);
            if (p != null && p.getFullName() != null && !p.getFullName().trim().isEmpty()) {
                String[] parts = p.getFullName().trim().split("\\s+");
                String lastName = parts[parts.length - 1];
                displayName = lastName + "(" + otherId + ")";
            } else {
                // Fallback format if no profile name
                displayName = otherId;
            }

            Long lid = m.getListingId();
            String lName = "General Chat";
            String lImage = null;

            if (lid != null) {
                com.appdevg4.mergemasters.mergechants.entity.ListingsEntity l = listingMap.get(lid);
                if (l != null) {
                    lName = l.getName();
                    // get first image
                    String allImages = l.getImages();
                    if (allImages != null && !allImages.isEmpty()) {
                        lImage = allImages.split(",")[0].trim();
                    }
                }
            }

            inbox.add(new com.appdevg4.mergemasters.mergechants.dto.InboxDTO(
                    otherId,
                    displayName,
                    m.getContent(),
                    m.getTimestamp(),
                    lid,
                    lName,
                    lImage));
        }

        inbox.sort((a, b) -> b.getTime().compareTo(a.getTime()));
        return inbox;
    }
}