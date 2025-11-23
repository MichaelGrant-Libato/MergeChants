package com.project.mergechants.backend.controller;

import com.project.mergechants.backend.entity.ListingsEntity;
import com.project.mergechants.backend.repository.ListingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/listings")
@CrossOrigin(origins = "http://localhost:3000")
public class ListingsController {

    @Autowired
    private ListingsRepository listingsRepository;

    private final DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;

    // CREATE LISTING
    @PostMapping
    public ResponseEntity<ListingsEntity> createListing(@RequestBody ListingsEntity listing) {

        String now = LocalDateTime.now().format(formatter);

        listing.setTime(now);
        listing.setCreatedAt(now);
        listing.setUpdatedAt(now);

        if (listing.getStatus() == null || listing.getStatus().isEmpty()) {
            listing.setStatus("PENDING");
        }

        // Prevent nulls from frontend
        if (listing.getTags() == null) listing.setTags("");
        if (listing.getImages() == null) listing.setImages("");

        ListingsEntity saved = listingsRepository.save(listing);
        return ResponseEntity.ok(saved);
    }

    // GET ALL LISTINGS
    @GetMapping
    public ResponseEntity<List<ListingsEntity>> getAllListings() {
        return ResponseEntity.ok(listingsRepository.findAll());
    }

    // GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<ListingsEntity> getListingById(@PathVariable Long id) {
        return listingsRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET LISTINGS BY SELLER
    @GetMapping("/seller/{seller}")
    public ResponseEntity<List<ListingsEntity>> getListingsBySeller(@PathVariable String seller) {
        return ResponseEntity.ok(listingsRepository.findBySeller(seller));
    }

    // GET BY CATEGORY
    @GetMapping("/category/{category}")
    public ResponseEntity<List<ListingsEntity>> getListingsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(listingsRepository.findByCategory(category));
    }

    // GET BY STATUS
    @GetMapping("/status/{status}")
    public ResponseEntity<List<ListingsEntity>> getListingsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(listingsRepository.findByStatus(status));
    }

    // UPDATE LISTING
    @PutMapping("/{id}")
    public ResponseEntity<ListingsEntity> updateListing(
            @PathVariable Long id,
            @RequestBody ListingsEntity body) {

        Optional<ListingsEntity> optional = listingsRepository.findById(id);

        if (optional.isEmpty()) return ResponseEntity.notFound().build();

        ListingsEntity listing = optional.get();

        listing.setName(body.getName());
        listing.setSubTitle(body.getSubTitle());
        listing.setCategory(body.getCategory());
        listing.setPrice(body.getPrice());
        listing.setOriginalPrice(body.getOriginalPrice());
        listing.setCondition(body.getCondition());
        listing.setCampus(body.getCampus());
        listing.setDescription(body.getDescription());
        listing.setPreferredLocation(body.getPreferredLocation());
        listing.setAvailableFrom(body.getAvailableFrom());
        listing.setAvailableUntil(body.getAvailableUntil());
        listing.setMeetingPreferences(body.getMeetingPreferences());
        listing.setTags(body.getTags() != null ? body.getTags() : "");
        listing.setImages(body.getImages() != null ? body.getImages() : "");

        listing.setUpdatedAt(LocalDateTime.now().format(formatter));

        ListingsEntity updated = listingsRepository.save(listing);
        return ResponseEntity.ok(updated);
    }

    // DELETE LISTING
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteListing(@PathVariable Long id) {
        if (!listingsRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        listingsRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // APPROVE LISTING
    @PatchMapping("/{id}/approve")
    public ResponseEntity<ListingsEntity> approveListing(@PathVariable Long id) {
        return updateStatus(id, "APPROVED");
    }

    // REJECT LISTING
    @PatchMapping("/{id}/reject")
    public ResponseEntity<ListingsEntity> rejectListing(@PathVariable Long id) {
        return updateStatus(id, "REJECTED");
    }

    // SHARED LOGIC
    private ResponseEntity<ListingsEntity> updateStatus(Long id, String newStatus) {
        Optional<ListingsEntity> optional = listingsRepository.findById(id);

        if (optional.isEmpty()) return ResponseEntity.notFound().build();

        ListingsEntity listing = optional.get();
        listing.setStatus(newStatus);
        listing.setUpdatedAt(LocalDateTime.now().format(formatter));

        ListingsEntity updated = listingsRepository.save(listing);
        return ResponseEntity.ok(updated);
    }
}