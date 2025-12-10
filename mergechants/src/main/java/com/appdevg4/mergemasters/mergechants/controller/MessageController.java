package com.appdevg4.mergemasters.mergechants.controller;

import com.appdevg4.mergemasters.mergechants.dto.BlockedUserDTO;
import com.appdevg4.mergemasters.mergechants.dto.ChatDTO;
import com.appdevg4.mergemasters.mergechants.dto.InboxDTO;
import com.appdevg4.mergemasters.mergechants.entity.MessageEntity;
import com.appdevg4.mergemasters.mergechants.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "http://localhost:3000")
public class MessageController {

    private final MessageService messageService;

    @Autowired
    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    /* ========================= SEND MESSAGE ========================= */
    @PostMapping
    public ResponseEntity<MessageEntity> sendMessage(@RequestBody MessageEntity message) {
        try {
            MessageEntity saved = messageService.sendMessage(message);
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException e) {
            // send the error text so frontend can distinguish who blocked whom
            return ResponseEntity.badRequest().body(null);
        }
    }

    /* ========================= CHAT HISTORY ========================= */
    @GetMapping("/{currentUser}/{otherUser}")
    public ResponseEntity<ChatDTO> getChatHistory(
            @PathVariable String currentUser,
            @PathVariable String otherUser,
            @RequestParam(required = false) Long listingId) {

        ChatDTO history = messageService.getChatHistory(currentUser, otherUser, listingId);
        return ResponseEntity.ok(history);
    }

    /* ========================= DELETE CHAT (PER CONVERSATION) ========================= */
    @DeleteMapping("/{user}/{other}")
    public ResponseEntity<Void> deleteChat(
            @PathVariable String user,
            @PathVariable String other,
            @RequestParam(required = false) Long listingId) {

        // if listingId is null → delete only "general" chat
        messageService.deleteChat(user, other, listingId);
        return ResponseEntity.ok().build();
    }

    /* ========================= INBOX ========================= */
    @GetMapping("/inbox/{userId}")
    public ResponseEntity<List<InboxDTO>> getMyInbox(@PathVariable String userId) {
        return ResponseEntity.ok(messageService.generateInbox(userId));
    }

    /* ========================= BLOCK / UNBLOCK ========================= */

    @PostMapping("/block")
    public ResponseEntity<Void> blockUser(
            @RequestParam String blockerId,
            @RequestParam String blockedId) {

        messageService.blockUser(blockerId, blockedId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/unblock")
    public ResponseEntity<Void> unblockUser(
            @RequestParam String blockerId,
            @RequestParam String blockedId) {

        boolean removed = messageService.unblockUser(blockerId, blockedId);
        if (removed) {
            return ResponseEntity.ok().build();
        } else {
            // nothing to delete
            return ResponseEntity.notFound().build();
        }
    }

    /* ========================= BLOCKED USERS (for Settings tab) ========================= */
    @GetMapping("/blocked/{blockerId}")
    public ResponseEntity<List<BlockedUserDTO>> getBlockedUsers(@PathVariable String blockerId) {
        return ResponseEntity.ok(messageService.getBlockedUsers(blockerId));
    }
}
