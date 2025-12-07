// backend/mergechants/src/main/java/com/appdevg4/mergemasters/mergechants/controller/TransactionReportController.java

package com.appdevg4.mergemasters.mergechants.controller;

import com.appdevg4.mergemasters.mergechants.dto.CreateReportRequest;
import com.appdevg4.mergemasters.mergechants.entity.TransactionReport;
import com.appdevg4.mergemasters.mergechants.service.TransactionReportService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
// 🔴 OLD:
// @RequestMapping("/api/reports")
// ✅ NEW (unique path):
@RequestMapping("/api/transaction-reports")
@CrossOrigin(origins = "http://localhost:3000")
public class TransactionReportController {

    private final TransactionReportService service;

    public TransactionReportController(TransactionReportService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<TransactionReport> createReport(
            @RequestBody CreateReportRequest request
    ) {
        TransactionReport saved = service.createReport(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
