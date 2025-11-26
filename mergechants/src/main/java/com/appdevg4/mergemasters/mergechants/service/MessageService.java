package com.appdevg4.mergemasters.mergechants.service;

import com.appdevg4.mergemasters.mergechants.entity.MessageEntity;
import com.appdevg4.mergemasters.mergechants.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MessageService {

    private final MessageRepository messageRepository;

    @Autowired
    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public MessageEntity sendMessage(MessageEntity message) {
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

    public List<MessageEntity> getChatHistory(String user1, String user2) {
        if (user1 == null || user2 == null) {
            throw new IllegalArgumentException("User IDs cannot be null");
        }
        return messageRepository.findChatHistory(user1, user2);
    }


    public List<MessageEntity> getUserInbox(String userId) {
        if (userId == null || userId.isEmpty()) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        return messageRepository.findBySenderIdOrReceiverId(userId, userId);
    }
}