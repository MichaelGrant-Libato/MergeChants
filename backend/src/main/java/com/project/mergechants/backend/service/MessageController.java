package com.project.mergechants.backend.service;

import com.project.mergechants.backend.entity.MessageEntity;
import com.project.mergechants.backend.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "http://localhost:3000")
public class MessageController {

    @Autowired
    private MessageRepository messageRepository;

    // 1. SEND A MESSAGE
    @PostMapping
    public ResponseEntity<MessageEntity> sendMessage(@RequestBody MessageEntity message) {
        message.setTimestamp(LocalDateTime.now()); // Auto-set time
        MessageEntity saved = messageRepository.save(message);
        return ResponseEntity.ok(saved);
    }

    // 2. GET CHAT HISTORY WITH A SPECIFIC PERSON
    @GetMapping("/{currentUser}/{otherUser}")
    public ResponseEntity<List<MessageEntity>> getChatHistory(
            @PathVariable String currentUser,
            @PathVariable String otherUser) {
        
        List<MessageEntity> history = messageRepository.findChatHistory(currentUser, otherUser);
        return ResponseEntity.ok(history);
    }

    // 3. GET ALL MY MESSAGES (To build the Sidebar Inbox)
    @GetMapping("/inbox/{userId}")
    public ResponseEntity<List<MessageEntity>> getMyInbox(@PathVariable String userId) {
        // This returns EVERY message you've ever sent or received.
        // The Frontend will need to group these to show "Recent Conversations"
        return ResponseEntity.ok(messageRepository.findBySenderIdOrReceiverId(userId, userId));
    }
}