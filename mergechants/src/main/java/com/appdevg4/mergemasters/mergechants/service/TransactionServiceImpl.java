// src/main/java/com/appdevg4/mergemasters/mergechants/service/TransactionServiceImpl.java
package com.appdevg4.mergemasters.mergechants.service;

import com.appdevg4.mergemasters.mergechants.entity.ListingsEntity;
import com.appdevg4.mergemasters.mergechants.entity.TransactionEntity;
import com.appdevg4.mergemasters.mergechants.repository.ListingsRepository;
import com.appdevg4.mergemasters.mergechants.repository.TransactionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final ListingsRepository listingRepository;

    public TransactionServiceImpl(TransactionRepository transactionRepository,
                                  ListingsRepository listingRepository) {
        this.transactionRepository = transactionRepository;
        this.listingRepository = listingRepository;
    }

    @Override
    @Transactional
    public TransactionEntity completeTransaction(Long listingId, String buyerId, String currentSellerId) {
      ListingsEntity listing = listingRepository.findById(listingId)
              .orElseThrow(() ->
                      new ResponseStatusException(HttpStatus.NOT_FOUND, "Listing not found"));

      // check seller
      if (listing.getSeller() == null ||
          !listing.getSeller().trim().equalsIgnoreCase(currentSellerId.trim())) {
          throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not the seller of this listing");
      }

      // avoid double-selling
      if (listing.getStatus() != null &&
              "SOLD".equalsIgnoreCase(listing.getStatus())) {
          throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Listing already sold");
      }

      // mark listing as SOLD
      listing.setStatus("SOLD");
      listingRepository.save(listing);

      // create transaction
      TransactionEntity tx = new TransactionEntity();
      tx.setListingId(listing.getId());
      tx.setListingName(listing.getName());
      tx.setPrice(listing.getPrice());
      tx.setSellerId(listing.getSeller());
      tx.setBuyerId(buyerId);
      tx.setCompletedAt(LocalDateTime.now());

      return transactionRepository.save(tx);
    }

    @Override
    public List<TransactionEntity> getHistoryForUser(String studentId) {
        return transactionRepository
                .findByBuyerIdOrSellerIdOrderByCompletedAtDesc(studentId, studentId);
    }
}
