// src/main/java/com/appdevg4/mergemasters/mergechants/dto/CompleteTransactionRequest.java
package com.appdevg4.mergemasters.mergechants.dto;

public class CompleteTransactionRequest {

    private Long listingId;
    private String buyerId;

    public Long getListingId() {
        return listingId;
    }

    
    public void setListingId(Long listingId) {
        this.listingId = listingId;
    }

    public String getBuyerId() {
        return buyerId;
    }

    public void setBuyerId(String buyerId) {
        this.buyerId = buyerId;
    }
}
