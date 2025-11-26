package com.project.mergechants.backend.service;

import com.project.mergechants.backend.entity.ReportEntity;
import com.project.mergechants.backend.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReportService {
    
    @Autowired
    private ReportRepository reportRepository;

    public ReportEntity createReport(ReportEntity report) {
        // Business Logic: Set timestamp and default status automatically
        report.setTimestamp(LocalDateTime.now());
        if (report.getStatus() == null) {
            report.setStatus("PENDING");
        }
        return reportRepository.save(report);
    }

    public List<ReportEntity> getAllReports() {
        return reportRepository.findAll();
    }

    public ReportEntity updateStatus(Long id, String newStatus) {
        return reportRepository.findById(id).map(report -> {
            report.setStatus(newStatus);
            return reportRepository.save(report);
        }).orElse(null);
    }
}