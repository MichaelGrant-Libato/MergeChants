package com.appdevg4.mergemasters.mergechants.controller;

import com.appdevg4.mergemasters.mergechants.entity.ListingsEntity;
import com.appdevg4.mergemasters.mergechants.service.ListingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/listings")
@CrossOrigin(origins = "http://localhost:3000")
public class ListingsController {

    @Autowired
    private ListingsService listingsService;


    @PostMapping
    public ResponseEntity<ListingsEntity> createListing(@RequestBody ListingsEntity listing) {
        ListingsEntity savedListing = listingsService.createListing(listing);
        return ResponseEntity.ok(savedListing);
    }

  
    @GetMapping
    public ResponseEntity<List<ListingsEntity>> getAllListings() {
        return ResponseEntity.ok(listingsService.getAllListings());
    }

  
    @GetMapping("/{id}")
    public ResponseEntity<ListingsEntity> getListingById(@PathVariable Long id) {
        return listingsService.getListingById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/seller/{seller}")
    public ResponseEntity<List<ListingsEntity>> getListingsBySeller(@PathVariable String seller) {
        return ResponseEntity.ok(listingsService.getListingsBySeller(seller));
    }


    @GetMapping("/category/{category}")
    public ResponseEntity<List<ListingsEntity>> getListingsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(listingsService.getListingsByCategory(category));
    }


    @GetMapping("/status/{status}")
    public ResponseEntity<List<ListingsEntity>> getListingsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(listingsService.getListingsByStatus(status));
    }

 
    @PutMapping("/{id}")
    public ResponseEntity<ListingsEntity> updateListing(@PathVariable Long id, @RequestBody ListingsEntity body) {
        return listingsService.updateListing(id, body)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteListing(@PathVariable Long id) {
        if (listingsService.deleteListing(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<ListingsEntity> approveListing(@PathVariable Long id) {
        return listingsService.updateStatus(id, "APPROVED")
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<ListingsEntity> rejectListing(@PathVariable Long id) {
        return listingsService.updateStatus(id, "REJECTED")
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}