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

    private String norm(String s) {
        if (s == null)
            return null;
        String t = s.trim();
        return t.isEmpty() ? null : t;
    }

    @Override
    public ProfileResponse create(ProfileRequest req) {
        String studentId = norm(req.getStudentId());
        String email = norm(req.getEmail());

        if (studentId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "studentId is required");
        }
        if (email == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "email is required");
        }

        if (profileRepository.existsByStudentId(studentId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Profile already exists for this studentId");
        }
        if (profileRepository.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        ProfileEntity profile = new ProfileEntity();
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

        String studentId = norm(req.getStudentId());
        String email = norm(req.getEmail());

        if (studentId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "studentId is required");
        }
        if (email == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "email is required");
        }

        if (!profile.getStudentId().equals(studentId) && profileRepository.existsByStudentId(studentId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "studentId already exists");
        }

        if (!profile.getEmail().equalsIgnoreCase(email) && profileRepository.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
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
    public ProfileResponse getByEmail(String email) {
        String e = norm(email);
        if (e == null)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "email is required");

        ProfileEntity profile = profileRepository.findByEmail(e)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found"));
        return toResponse(profile);
    }

    @Override
    public ProfileResponse getByStudentId(String studentId) {
        String s = norm(studentId);
        if (s == null)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "studentId is required");

        ProfileEntity profile = profileRepository.findByStudentId(s)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found"));
        return toResponse(profile);
    }

    private void applyReq(ProfileEntity profile, ProfileRequest req) {
        profile.setStudentId(norm(req.getStudentId()));
        profile.setFullName(norm(req.getFullName()));
        profile.setEmail(norm(req.getEmail()));
        profile.setPhone(norm(req.getPhone()));
        profile.setCampus(norm(req.getCampus()));
        profile.setBio(norm(req.getBio()));
    }

    private ProfileResponse toResponse(ProfileEntity profile) {
        return new ProfileResponse(
                profile.getId(),
                profile.getStudentId(),
                profile.getFullName(),
                profile.getEmail(),
                profile.getPhone(),
                profile.getCampus(),
                profile.getBio());
    }
}
