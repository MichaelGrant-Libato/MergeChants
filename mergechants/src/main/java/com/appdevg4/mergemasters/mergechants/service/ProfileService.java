package com.appdevg4.mergemasters.mergechants.service;

import com.appdevg4.mergemasters.mergechants.dto.ProfileRequest;
import com.appdevg4.mergemasters.mergechants.dto.ProfileResponse;

import java.util.List;

public interface ProfileService {
    ProfileResponse create(ProfileRequest req);

    ProfileResponse getById(Long id);

    ProfileResponse getByStudentId(String studentId);

    List<ProfileResponse> getAll();

    ProfileResponse update(Long id, ProfileRequest req);

    void delete(Long id);
}
