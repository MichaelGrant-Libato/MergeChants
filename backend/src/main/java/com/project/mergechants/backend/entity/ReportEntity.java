package com.project.mergechants.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "reports")
public class ReportEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reportId;

    private String reporterId;   // Who is complaining?
    private String reportedId;   // Who is being reported?
    private String reason;       // e.g., "Scam", "Harassment"
    private String evidence;     // e.g., Link to screenshot
    private String status;       // "PENDING", "RESOLVED"

    private LocalDateTime timestamp;
}