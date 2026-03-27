package com.backend.service;

import com.backend.dto.LoginRequest;
import com.backend.dto.RegisterRequest;
import com.backend.model.User;
import com.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder;

    public void register(RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("User already exists");
        }

        User user = new User();
        user.setFullname(request.getFullname());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setPassword(encoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        userRepository.save(user);
    }

    public User login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!encoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        // Validate role only when client explicitly sends it.
        if (request.getRole() != null && !request.getRole().isBlank()
                && !user.getRole().equalsIgnoreCase(request.getRole())) {
            throw new RuntimeException("Role mismatch");
        }

        return user;
    }

    public User getById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateUserRole(String userId, String role) {
        User user = getById(userId);

        String normalizedRole = role == null ? "" : role.trim().toLowerCase();
        if (!normalizedRole.equals("admin") && !normalizedRole.equals("student")) {
            throw new RuntimeException("Invalid role");
        }

        user.setRole(normalizedRole);
        user.setUpdatedAt(Instant.now());

        return userRepository.save(user);
    }

    public User updateProfile(
            String userId,
            String fullName,
            String phoneNumber,
            String bio,
            String skills,
            MultipartFile profileImage,
            MultipartFile resume
    ) {
        User user = getById(userId);

        if (fullName != null && !fullName.isBlank()) {
            user.setFullname(fullName.trim());
        }

        if (phoneNumber != null && !phoneNumber.isBlank()) {
            user.setPhoneNumber(phoneNumber.trim());
        }

        User.Profile profile = user.getProfile();
        if (profile == null) {
            profile = new User.Profile();
        }

        if (bio != null) {
            profile.setBio(bio.trim());
        }

        if (skills != null) {
            List<String> skillList = Arrays.stream(skills.split(","))
                    .map(String::trim)
                    .filter(value -> !value.isEmpty())
                    .toList();
            profile.setSkills(skillList);
        }

        if (profileImage != null && !profileImage.isEmpty()) {
            profile.setProfilePhoto(profileImage.getOriginalFilename());
        }

        if (resume != null && !resume.isEmpty()) {
            profile.setResume(resume.getOriginalFilename());
            profile.setResumeOriginalName(resume.getOriginalFilename());
        }

        user.setProfile(profile);
        user.setUpdatedAt(Instant.now());

        return userRepository.save(user);
    }
}