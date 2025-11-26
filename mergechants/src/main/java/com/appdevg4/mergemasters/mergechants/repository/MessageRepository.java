package com.appdevg4.mergemasters.mergechants.repository;

import com.appdevg4.mergemasters.mergechants.entity.MessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface MessageRepository extends JpaRepository<MessageEntity, Long> {

  
    List<MessageEntity> findBySenderIdOrReceiverId(String senderId, String receiverId);


    @Query("SELECT m FROM MessageEntity m WHERE " +
           "(m.senderId = :user1 AND m.receiverId = :user2) OR " +
           "(m.senderId = :user2 AND m.receiverId = :user1) " +
           "ORDER BY m.timestamp ASC")
    List<MessageEntity> findChatHistory(String user1, String user2);
}