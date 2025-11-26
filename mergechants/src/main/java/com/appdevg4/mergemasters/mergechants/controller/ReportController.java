package com.appdevg4.mergemasters.mergechants.controller;

import com.appdevg4.mergemasters.mergechants.entity.ReportEntity;
import com.appdevg4.mergemasters.mergechants.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:3000")
public class ReportController {

    @Autowired
    private ReportService reportService; 

    @PostMapping
    public ReportEntity submitReport(@RequestBody ReportEntity report) {
        return reportService.createReport(report);
    }

    @GetMapping
    public List<ReportEntity> getReports() {
        return reportService.getAllReports();
    }

    @PatchMapping("/{id}/status")
    public ReportEntity updateStatus(@PathVariable Long id, @RequestParam String status) {
        return reportService.updateStatus(id, status);
    }
}