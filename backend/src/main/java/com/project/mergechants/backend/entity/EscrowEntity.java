package com.project.mergechants.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "escrow_agreements")
public class EscrowEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long escrowId;

    private Long listingId;
    private String buyerId;
    private String sellerId;

    @Column(columnDefinition = "TEXT")
    private String agreementTerms; 

    private String status; // "AGREED", "PENDING", "COMPLETED"
}