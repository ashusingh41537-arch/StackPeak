package com.backend.controller;

import com.backend.config.JwtUtil;
import com.backend.model.Application;
import com.backend.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/application")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;
    private final JwtUtil jwtUtil;

    @PostMapping("/apply/{id}")
    public ResponseEntity<?> applyPost(
            @PathVariable String id,
            @RequestHeader(value = "Authorization", required = false) String authorization
    ) {
        return applyInternal(id, authorization);
    }

    @GetMapping("/apply/{id}")
    public ResponseEntity<?> applyGet(
            @PathVariable String id,
            @RequestHeader(value = "Authorization", required = false) String authorization
    ) {
        return applyInternal(id, authorization);
    }

    @GetMapping("/get")
    public ResponseEntity<?> getMyApplications(
            @RequestHeader(value = "Authorization", required = false) String authorization
    ) {
        String userId = extractUserId(authorization);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Missing, invalid, or expired token"));
        }

        return ResponseEntity.ok(Map.of(
                "applications", applicationService.getMyApplications(userId)
        ));
    }

    @GetMapping("/{id}/applicants")
    public ResponseEntity<?> getApplicantsByJob(@PathVariable("id") String jobId) {
        return ResponseEntity.ok(Map.of(
                "applicants", applicationService.getApplicantsByJob(jobId)
        ));
    }

    @PostMapping("/status/{id}/update")
    public ResponseEntity<?> updateStatus(
            @PathVariable("id") String applicationId,
            @RequestBody String rawStatus
    ) {
        String status = extractStatus(rawStatus);
        Application updated = applicationService.updateStatus(applicationId, status);

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("id", updated.getId());
        payload.put("status", updated.getStatus());

        return ResponseEntity.ok(Map.of(
                "message", "Application status updated successfully.",
                "application", payload
        ));
    }

    private ResponseEntity<?> applyInternal(String jobId, String authorization) {
        String userId = extractUserId(authorization);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Missing, invalid, or expired token"));
        }

        Application application = applicationService.apply(jobId, userId);
        return ResponseEntity.status(201)
                .body(Map.of("message", "Applied successfully.", "application", application));
    }

    private String extractUserId(String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            return null;
        }

        String token = authorization.substring(7).trim();
        if (!jwtUtil.validateToken(token)) {
            return null;
        }

        return jwtUtil.extractUserId(token);
    }

    private String extractStatus(String raw) {
        if (raw == null) {
            return "";
        }

        String value = raw.trim();
        if (value.startsWith("{") && value.contains("status")) {
            int idx = value.toLowerCase().indexOf("status");
            int colon = value.indexOf(':', idx);
            if (colon > -1) {
                String right = value.substring(colon + 1).trim();
                right = right.replaceAll("[{}\"']", "").trim();
                if (right.contains(",")) {
                    right = right.substring(0, right.indexOf(',')).trim();
                }
                return right;
            }
        }

        if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.substring(1, value.length() - 1);
        }
        return value;
    }
}