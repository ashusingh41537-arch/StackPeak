package com.backend.controller;

import com.backend.config.JwtUtil;
import com.backend.dto.LoginRequest;
import com.backend.dto.RegisterRequest;
import com.backend.model.User;
import com.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {

        userService.register(request);

        return ResponseEntity.status(201)
                .body("Account created successfully.");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        User user = userService.login(request);
        String token = jwtUtil.generateToken(user.getId());

        return ResponseEntity.ok(Map.of(
                "token", token,
                "user", toUserPayload(user)
        ));
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestHeader(value = "Authorization", required = false) String authorization) {
        User user = authenticateAndGetUser(authorization);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Missing, invalid, or expired token"));
        }

        return ResponseEntity.ok(Map.of("user", toUserPayload(user)));
    }

    @PutMapping(value = "/profile/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateProfile(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @RequestParam(value = "FullName", required = false) String fullName,
            @RequestParam(value = "PhoneNumber", required = false) String phoneNumber,
            @RequestParam(value = "Bio", required = false) String bio,
            @RequestParam(value = "Skills", required = false) String skills,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage,
            @RequestPart(value = "resume", required = false) MultipartFile resume
    ) {
        User user = authenticateAndGetUser(authorization);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Missing, invalid, or expired token"));
        }

        User updatedUser = userService.updateProfile(
                user.getId(),
                fullName,
                phoneNumber,
                bio,
                skills,
                profileImage,
                resume
        );

        return ResponseEntity.ok(Map.of(
                "message", "Profile updated successfully.",
                "user", toUserPayload(updatedUser)
        ));
    }

    @GetMapping("/admin/all")
    public ResponseEntity<?> getAllUsers() {
        List<Map<String, Object>> users = userService.getAllUsers()
                .stream()
                .map(this::toUserPayload)
                .toList();

        return ResponseEntity.ok(Map.of("users", users));
    }

    @PutMapping("/admin/role/{id}")
    public ResponseEntity<?> updateUserRole(
            @PathVariable("id") String userId,
            @RequestBody Map<String, String> payload
    ) {
        String role = payload.getOrDefault("role", "");
        User updatedUser = userService.updateUserRole(userId, role);

        return ResponseEntity.ok(Map.of(
                "message", "User role updated successfully.",
                "user", toUserPayload(updatedUser)
        ));
    }

    private User authenticateAndGetUser(String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            return null;
        }

        String token = authorization.substring(7).trim();
        if (!jwtUtil.validateToken(token)) {
            return null;
        }

        String userId = jwtUtil.extractUserId(token);
        return userService.getById(userId);
    }

    private Map<String, Object> toUserPayload(User user) {
        Map<String, Object> userPayload = new LinkedHashMap<>();
        userPayload.put("id", user.getId());
        userPayload.put("fullName", user.getFullname());
        userPayload.put("email", user.getEmail());
        userPayload.put("phoneNumber", user.getPhoneNumber());
        userPayload.put("role", user.getRole());

        User.Profile profile = user.getProfile();
        if (profile != null) {
            userPayload.put("bio", profile.getBio());
            userPayload.put("skills", profile.getSkills() == null ? "" : String.join(", ", profile.getSkills()));
            userPayload.put("resume", profile.getResume());
            userPayload.put("resumeOriginalName", profile.getResumeOriginalName());
            userPayload.put("profilePhoto", profile.getProfilePhoto());
        } else {
            userPayload.put("bio", null);
            userPayload.put("skills", "");
            userPayload.put("resume", null);
            userPayload.put("resumeOriginalName", null);
            userPayload.put("profilePhoto", null);
        }

        userPayload.put("profile", profile);
        return userPayload;
    }
}