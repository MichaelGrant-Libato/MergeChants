package com.appdevg4.mergemasters.mergechants.service;

import com.appdevg4.mergemasters.mergechants.dto.CreateReportRequest;
import com.appdevg4.mergemasters.mergechants.entity.TransactionReport;
import com.appdevg4.mergemasters.mergechants.repository.TransactionReportRepository;
import org.springframework.stereotype.Service;

@Service
public class TransactionReportService {

    private final TransactionReportRepository repository;

    public TransactionReportService(TransactionReportRepository repository) {
        this.repository = repository;
    }

    public TransactionReport createReport(CreateReportRequest request) {
        TransactionReport report = new TransactionReport();
        report.setTransactionId(request.getTransactionId());
        report.setListingId(request.getListingId());
        report.setReporterId(request.getReporterId());
        report.setReportedUserId(request.getReportedUserId());
        report.setRole(request.getRole());
        report.setConcerns(request.getConcerns());
        report.setExpectedOutcome(request.getExpectedOutcome());
        return repository.save(report);
    }
}
