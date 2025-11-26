package com.appdevg4.mergemasters.mergechants.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "messages")
public class MessageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String senderId;    
    private String receiverId; 
    
    
    private Long listingId; 

    @Column(length = 1000)
    private String content;     

    private LocalDateTime timestamp; 
}