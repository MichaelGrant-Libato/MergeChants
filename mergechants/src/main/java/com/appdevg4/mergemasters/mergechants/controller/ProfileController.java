package com.appdevg4.mergemasters.mergechants.controller;

import com.appdevg4.mergemasters.mergechants.dto.ProfileRequest;
import com.appdevg4.mergemasters.mergechants.dto.ProfileResponse;
import com.appdevg4.mergemasters.mergechants.service.ProfileService;
import org.springframework.web.bind.annotation.*;

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
    public ProfileResponse create(@RequestBody ProfileRequest req) {
        return profileService.create(req);
    }

    @GetMapping("/{id}")
    public ProfileResponse getById(@PathVariable Long id) {
        return profileService.getById(id);
    }

    @GetMapping
    public List<ProfileResponse> getAll() {
        return profileService.getAll();
    }

    @PutMapping("/{id}")
    public ProfileResponse update(@PathVariable Long id, @RequestBody ProfileRequest req) {
        return profileService.update(id, req);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        profileService.delete(id);
    }

    @GetMapping("/email/{email}")
    public ProfileResponse getByEmail(@PathVariable String email) {
        return profileService.getByEmail(email);
    }

    @GetMapping("/student/{studentId}")
    public ProfileResponse getByStudentId(@PathVariable String studentId) {
        return profileService.getByStudentId(studentId);
    }
}
