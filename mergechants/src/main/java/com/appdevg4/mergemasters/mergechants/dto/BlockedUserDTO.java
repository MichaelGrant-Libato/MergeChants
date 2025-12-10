package com.appdevg4.mergemasters.mergechants.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlockedUserDTO {
    private String userId;       
    private String displayName;  
    private String profilePic;  
}
