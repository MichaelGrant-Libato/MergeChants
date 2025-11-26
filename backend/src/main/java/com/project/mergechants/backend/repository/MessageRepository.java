package com.project.mergechants.backend.repository;

import com.project.mergechants.backend.entity.MessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface MessageRepository extends JpaRepository<MessageEntity, Long> {

    // Find all messages involving a specific user (Sent OR Received)
    // We use this to build the "Inbox" list
    List<MessageEntity> findBySenderIdOrReceiverId(String senderId, String receiverId);

    // Find the specific chat history between two people
    // "Give me all messages where (Sender is A and Receiver is B) OR (Sender is B and Receiver is A)"
    @Query("SELECT m FROM MessageEntity m WHERE " +
           "(m.senderId = :user1 AND m.receiverId = :user2) OR " +
           "(m.senderId = :user2 AND m.receiverId = :user1) " +
           "ORDER BY m.timestamp ASC")
    List<MessageEntity> findChatHistory(String user1, String user2);
}