package com.appdevg4.mergemasters.mergechants.service;

import com.appdevg4.mergemasters.mergechants.entity.ListingsEntity;
import com.appdevg4.mergemasters.mergechants.repository.ListingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class ListingsService {

    @Autowired
    private ListingsRepository listingsRepository;

    private final DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;

    
    public ListingsEntity createListing(ListingsEntity listing) {
        String now = LocalDateTime.now().format(formatter);

        listing.setTime(now);
        listing.setCreatedAt(now);
        listing.setUpdatedAt(now);

        if (listing.getStatus() == null || listing.getStatus().isEmpty()) {
            listing.setStatus("PENDING");
        }

        // Prevent nulls
        if (listing.getTags() == null) listing.setTags("");
        if (listing.getImages() == null) listing.setImages("");

        return listingsRepository.save(listing);
    }

    // READ ALL
    public List<ListingsEntity> getAllListings() {
        return listingsRepository.findAll();
    }

    // READ ONE
    public Optional<ListingsEntity> getListingById(Long id) {
        return listingsRepository.findById(id);
    }

    // READ BY SELLER
    public List<ListingsEntity> getListingsBySeller(String seller) {
        return listingsRepository.findBySeller(seller);
    }

    // READ BY CATEGORY
    public List<ListingsEntity> getListingsByCategory(String category) {
        return listingsRepository.findByCategory(category);
    }

    // READ BY STATUS
    public List<ListingsEntity> getListingsByStatus(String status) {
        return listingsRepository.findByStatus(status);
    }

    // UPDATE
    public Optional<ListingsEntity> updateListing(Long id, ListingsEntity body) {
        Optional<ListingsEntity> optional = listingsRepository.findById(id);

        if (optional.isEmpty()) {
            return Optional.empty();
        }

        ListingsEntity listing = optional.get();

        // Update fields
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

        return Optional.of(listingsRepository.save(listing));
    }

    // DELETE
    public boolean deleteListing(Long id) {
        if (listingsRepository.existsById(id)) {
            listingsRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // UPDATE STATUS (Approve/Reject)
    public Optional<ListingsEntity> updateStatus(Long id, String newStatus) {
        Optional<ListingsEntity> optional = listingsRepository.findById(id);

        if (optional.isEmpty()) {
            return Optional.empty();
        }

        ListingsEntity listing = optional.get();
        listing.setStatus(newStatus);
        listing.setUpdatedAt(LocalDateTime.now().format(formatter));

        return Optional.of(listingsRepository.save(listing));
    }
}