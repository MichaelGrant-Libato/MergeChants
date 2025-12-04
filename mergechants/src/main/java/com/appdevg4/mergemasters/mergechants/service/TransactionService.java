// src/main/java/com/appdevg4/mergemasters/mergechants/service/TransactionService.java
package com.appdevg4.mergemasters.mergechants.service;

import com.appdevg4.mergemasters.mergechants.entity.TransactionEntity;

import java.util.List;

public interface TransactionService {

    TransactionEntity completeTransaction(Long listingId, String buyerId, String currentSellerId);

    List<TransactionEntity> getHistoryForUser(String studentId);
}
