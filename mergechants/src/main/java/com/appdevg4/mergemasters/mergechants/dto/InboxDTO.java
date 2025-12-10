package com.appdevg4.mergemasters.mergechants.dto;

import java.time.LocalDateTime;

public class InboxDTO {
    private String otherUserId;
    private String otherUserName;
    private String lastMessage;
    private LocalDateTime time;

    private Long listingId;
    private String listingName;
    private String listingImage;

    public InboxDTO() {
    }

    public InboxDTO(String otherUserId, String otherUserName, String lastMessage, LocalDateTime time, Long listingId,
            String listingName, String listingImage) {
        this.otherUserId = otherUserId;
        this.otherUserName = otherUserName;
        this.lastMessage = lastMessage;
        this.time = time;
        this.listingId = listingId;
        this.listingName = listingName;
        this.listingImage = listingImage;
    }

    // Getters and Setters
    public String getOtherUserId() {
        return otherUserId;
    }

    public void setOtherUserId(String otherUserId) {
        this.otherUserId = otherUserId;
    }

    public String getOtherUserName() {
        return otherUserName;
    }

    public void setOtherUserName(String otherUserName) {
        this.otherUserName = otherUserName;
    }

    public String getLastMessage() {
        return lastMessage;
    }

    public void setLastMessage(String lastMessage) {
        this.lastMessage = lastMessage;
    }

    public LocalDateTime getTime() {
        return time;
    }

    public void setTime(LocalDateTime time) {
        this.time = time;
    }

    public Long getListingId() {
        return listingId;
    }

    public void setListingId(Long listingId) {
        this.listingId = listingId;
    }

    public String getListingName() {
        return listingName;
    }

    public void setListingName(String listingName) {
        this.listingName = listingName;
    }

    public String getListingImage() {
        return listingImage;
    }

    public void setListingImage(String listingImage) {
        this.listingImage = listingImage;
    }
}
