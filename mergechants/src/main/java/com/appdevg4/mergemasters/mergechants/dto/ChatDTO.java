package com.appdevg4.mergemasters.mergechants.dto;

import com.appdevg4.mergemasters.mergechants.entity.MessageEntity;
import java.util.List;

public class ChatDTO {
    private List<MessageEntity> messages;
    private boolean isBlocked;
    private String blockedBy;

    public ChatDTO(List<MessageEntity> messages, boolean isBlocked, String blockedBy) {
        this.messages = messages;
        this.isBlocked = isBlocked;
        this.blockedBy = blockedBy;
    }

    public List<MessageEntity> getMessages() {
        return messages;
    }

    public void setMessages(List<MessageEntity> messages) {
        this.messages = messages;
    }

    public boolean isBlocked() {
        return isBlocked;
    }

    public void setBlocked(boolean blocked) {
        isBlocked = blocked;
    }

    public String getBlockedBy() {
        return blockedBy;
    }

    public void setBlockedBy(String blockedBy) {
        this.blockedBy = blockedBy;
    }
}
