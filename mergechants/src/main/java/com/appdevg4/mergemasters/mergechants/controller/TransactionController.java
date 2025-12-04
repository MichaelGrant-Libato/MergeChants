// src/main/java/com/appdevg4/mergemasters/mergechants/controller/TransactionController.java
package com.appdevg4.mergemasters.mergechants.controller;

import com.appdevg4.mergemasters.mergechants.dto.CompleteTransactionRequest;
import com.appdevg4.mergemasters.mergechants.entity.TransactionEntity;
import com.appdevg4.mergemasters.mergechants.service.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:3000")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping("/complete")
    public ResponseEntity<?> completeTransaction(
            @RequestHeader("X-Student-Id") String currentSellerId,
            @RequestBody CompleteTransactionRequest request
    ) {
        TransactionEntity tx =
                transactionService.completeTransaction(
                        request.getListingId(),
                        request.getBuyerId(),
                        currentSellerId
                );
        return ResponseEntity.ok(tx);
    }

    @GetMapping("/history/{studentId}")
    public List<TransactionEntity> getHistory(@PathVariable String studentId) {
        return transactionService.getHistoryForUser(studentId);
    }
}
