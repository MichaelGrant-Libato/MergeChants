package com.appdevg4.mergemasters.mergechants.service;

import com.appdevg4.mergemasters.mergechants.entity.ReportEntity;
import com.appdevg4.mergemasters.mergechants.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReportService {
    
    @Autowired
    private ReportRepository reportRepository;

    public ReportEntity createReport(ReportEntity report) {
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