package com.project.mergechants.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "listings")
public class ListingsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String seller;

    private String name;
    private String subTitle;
    private String category;

    private double price;
    private double originalPrice;

    @Column(name = "item_condition")
    private String condition;
    private String campus;

    private String time;

    private double ratings = 0;
    private int reviews = 0;

    private String tags = "";

    @Column(length = 2000)
    private String description;

    

    private String preferredLocation;
    private String availableFrom;
    private String availableUntil;

    private String meetingPreferences;

    @Column(length = 1000)
    private String images = ""; 

    private String status = "PENDING";

    @Column(name = "created_at")
    private String createdAt;

    @Column(name = "updated_at")
    private String updatedAt;
}