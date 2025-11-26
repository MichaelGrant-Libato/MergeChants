package com.appdevg4.mergemasters.mergechants.entity;

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

    private String reporterId;   
    private String reportedId;   
    private String reason;       
    private String evidence;    
    private String status;      

    private LocalDateTime timestamp;
}