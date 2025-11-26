package com.project.mergechants.backend.controller;

import com.project.mergechants.backend.dto.ProfileRequest;
import com.project.mergechants.backend.dto.ProfileResponse;
import com.project.mergechants.backend.service.ProfileService;
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
        return ResponseEntity.ok(profileService.getAll()); // 200
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProfileResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(profileService.getById(id)); // 200
    }

    @GetMapping("/by-email")
    public ResponseEntity<ProfileResponse> getByEmail(@RequestParam String email) {
        return ResponseEntity.ok(profileService.getByEmail(email)); // 200
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProfileResponse> update(@PathVariable Long id, @Valid @RequestBody ProfileRequest req) {
        return ResponseEntity.ok(profileService.update(id, req)); // 200
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        profileService.delete(id);
        return ResponseEntity.noContent().build(); // 204
    }
}
