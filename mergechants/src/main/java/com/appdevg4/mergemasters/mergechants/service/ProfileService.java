package com.appdevg4.mergemasters.mergechants.service;

import com.appdevg4.mergemasters.mergechants.dto.ProfileRequest;
import com.appdevg4.mergemasters.mergechants.dto.ProfileResponse;
import com.appdevg4.mergemasters.mergechants.entity.ProfileEntity;
import com.appdevg4.mergemasters.mergechants.repository.ProfileRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProfileService {

    private final ProfileRepository profileRepository;

    public ProfileService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    public ProfileResponse create(ProfileRequest req) {
        if (profileRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already exists: " + req.getEmail());
        }
        ProfileEntity saved = profileRepository.save(toEntity(new ProfileEntity(), req));
        return toResponse(saved);
    }

    public List<ProfileResponse> getAll() {
        return profileRepository.findAll().stream().map(this::toResponse).toList();
    }

    public ProfileResponse getById(Long id) {
        ProfileEntity p = profileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Profile not found: " + id));
        return toResponse(p);
    }

    public ProfileResponse getByEmail(String email) {
        ProfileEntity p = profileRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Profile not found for email: " + email));
        return toResponse(p);
    }

    public ProfileResponse update(Long id, ProfileRequest req) {
        ProfileEntity existing = profileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Profile not found: " + id));

        if (!existing.getEmail().equals(req.getEmail()) && profileRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already exists: " + req.getEmail());
        }

        ProfileEntity saved = profileRepository.save(toEntity(existing, req));
        return toResponse(saved);
    }

    public void delete(Long id) {
        if (!profileRepository.existsById(id)) {
            throw new RuntimeException("Profile not found: " + id);
        }
        profileRepository.deleteById(id);
    }

    private ProfileEntity toEntity(ProfileEntity target, ProfileRequest req) {
        target.setFullName(req.getFullName());
        target.setEmail(req.getEmail());
        target.setPhone(req.getPhone());
        target.setCampus(req.getCampus());
        target.setBio(req.getBio());
        return target;
    }

    private ProfileResponse toResponse(ProfileEntity e) {
        return new ProfileResponse(
                e.getId(),
                e.getFullName(),
                e.getEmail(),
                e.getPhone(),
                e.getCampus(),
                e.getBio());
    }
}
