package com.appdevg4.mergemasters.mergechants.service;

import com.appdevg4.mergemasters.mergechants.dto.ProfileRequest;
import com.appdevg4.mergemasters.mergechants.dto.ProfileResponse;
import com.appdevg4.mergemasters.mergechants.entity.ProfileEntity;
import com.appdevg4.mergemasters.mergechants.repository.ProfileRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ProfileServiceImpl implements ProfileService {

    private final ProfileRepository profileRepository;

    public ProfileServiceImpl(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    private String normalize(String v) {
        if (v == null)
            return null;
        String t = v.trim();
        return t.isEmpty() ? null : t;
    }

    private String generatedEmail(String studentId) {
        String safe = studentId == null ? "unknown" : studentId.trim().toLowerCase().replaceAll("[^a-z0-9]+", "");
        return "sid_" + safe + "@mergechants.local";
    }

    @Override
    public ProfileResponse create(ProfileRequest req) {
        String studentId = normalize(req.getStudentId());
        if (studentId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "studentId is required");
        }

        if (profileRepository.existsByStudentId(studentId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Profile already exists for this studentId");
        }

        String email = normalize(req.getEmail());
        if (email == null) {
            email = generatedEmail(studentId);
        }

        if (profileRepository.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        ProfileEntity profile = new ProfileEntity();
        profile.setStudentId(studentId);
        profile.setEmail(email);

        applyReq(profile, req);

        ProfileEntity saved = profileRepository.save(profile);
        return toResponse(saved);
    }

    @Override
    public ProfileResponse getById(Long id) {
        ProfileEntity profile = profileRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found"));
        return toResponse(profile);
    }

    @Override
    public List<ProfileResponse> getAll() {
        return profileRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    public ProfileResponse update(Long id, ProfileRequest req) {
        ProfileEntity profile = profileRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found"));

        String incomingStudentId = normalize(req.getStudentId());
        if (incomingStudentId != null && !incomingStudentId.equalsIgnoreCase(profile.getStudentId())) {
            if (profileRepository.existsByStudentId(incomingStudentId)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Profile already exists for this studentId");
            }
            profile.setStudentId(incomingStudentId);
        }

        String incomingEmail = normalize(req.getEmail());
        String currentEmail = normalize(profile.getEmail());

        if (incomingEmail == null && currentEmail == null) {
            String sid = normalize(profile.getStudentId());
            profile.setEmail(generatedEmail(sid));
        } else if (incomingEmail != null && (currentEmail == null || !currentEmail.equalsIgnoreCase(incomingEmail))) {
            if (profileRepository.existsByEmail(incomingEmail)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
            }
            profile.setEmail(incomingEmail);
        }

        applyReq(profile, req);

        ProfileEntity saved = profileRepository.save(profile);
        return toResponse(saved);
    }

    @Override
    public void delete(Long id) {
        if (!profileRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found");
        }
        profileRepository.deleteById(id);
    }

    @Override
    public ProfileResponse getByStudentId(String studentId) {
        String normalized = normalize(studentId);
        if (normalized == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "studentId is required");
        }
        ProfileEntity profile = profileRepository.findByStudentId(normalized)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found"));
        return toResponse(profile);
    }

    private void applyReq(ProfileEntity profile, ProfileRequest req) {
        profile.setFullName(normalize(req.getFullName()));
        profile.setPhone(normalize(req.getPhone()));
        profile.setCampus(normalize(req.getCampus()));
        profile.setBio(normalize(req.getBio()));
        profile.setProfilePic(normalize(req.getProfilePic()));
    }

    private ProfileResponse toResponse(ProfileEntity profile) {
        return new ProfileResponse(
                profile.getId(),
                profile.getStudentId(),
                profile.getFullName(),
                profile.getEmail(),
                profile.getPhone(),
                profile.getCampus(),
                profile.getBio(),
                profile.getProfilePic());
    }
}
