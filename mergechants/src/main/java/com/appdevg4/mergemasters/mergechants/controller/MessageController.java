package com.appdevg4.mergemasters.mergechants.controller;

import com.appdevg4.mergemasters.mergechants.entity.MessageEntity;
import com.appdevg4.mergemasters.mergechants.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.appdevg4.mergemasters.mergechants.dto.ChatDTO;
import com.appdevg4.mergemasters.mergechants.dto.InboxDTO;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "http://localhost:3000")
public class MessageController {

    private final MessageService messageService;

    @Autowired
    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping
    public ResponseEntity<MessageEntity> sendMessage(@RequestBody MessageEntity message) {
        try {
            MessageEntity saved = messageService.sendMessage(message);
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{currentUser}/{otherUser}")
    public ResponseEntity<ChatDTO> getChatHistory(
            @PathVariable String currentUser,
            @PathVariable String otherUser,
            @RequestParam(required = false) Long listingId) {

        ChatDTO history = messageService.getChatHistory(currentUser, otherUser, listingId);
        return ResponseEntity.ok(history);
    }

    @DeleteMapping("/{user}/{other}")
    public ResponseEntity<Void> deleteChat(@PathVariable String user, @PathVariable String other) {
        messageService.deleteChat(user, other);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/inbox/{userId}")
    public ResponseEntity<List<InboxDTO>> getMyInbox(@PathVariable String userId) {
        return ResponseEntity.ok(messageService.generateInbox(userId));
    }
}