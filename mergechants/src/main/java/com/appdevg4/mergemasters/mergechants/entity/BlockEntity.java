package com.appdevg4.mergemasters.mergechants.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(
    name = "blocks",
    uniqueConstraints = @UniqueConstraint(columnNames = {"blockerId", "blockedId"})
)
public class BlockEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String blockerId;
    private String blockedId;
}
