package com.appdevg4.mergemasters.mergechants.controller;

import com.appdevg4.mergemasters.mergechants.dto.ProfileRequest;
import com.appdevg4.mergemasters.mergechants.dto.ProfileResponse;
import com.appdevg4.mergemasters.mergechants.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/profiles")
@CrossOrigin(origins = "http://localhost:3000")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @PostMapping
    public ResponseEntity<ProfileResponse> create(@Valid @RequestBody ProfileRequest req) {
        ProfileResponse created = profileService.create(req);
        return ResponseEntity.created(URI.create("/api/profiles/" + created.getId())).body(created); // 201
    }

    @GetMapping
    public ResponseEntity<List<ProfileResponse>> getAll() {
        return ResponseEntity.ok(profileService.getAll()); 
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProfileResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(profileService.getById(id)); 
    }

    @GetMapping("/by-email")
    public ResponseEntity<ProfileResponse> getByEmail(@RequestParam String email) {
        return ResponseEntity.ok(profileService.getByEmail(email)); 
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProfileResponse> update(@PathVariable Long id, @Valid @RequestBody ProfileRequest req) {
        return ResponseEntity.ok(profileService.update(id, req)); 
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        profileService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
