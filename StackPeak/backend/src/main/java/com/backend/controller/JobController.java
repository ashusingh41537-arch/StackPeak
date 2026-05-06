package com.backend.controller;

import com.backend.dto.JobDTO;
import com.backend.model.Job;
import com.backend.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/job")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @PostMapping("/post")
    public ResponseEntity<?> create(@RequestBody JobDTO dto) {

        Job created = jobService.create(dto, "loggedUserId");

        return ResponseEntity.status(201)
                .body(Map.of("message", "Job created successfully.", "job", toJobPayload(created)));
    }

    @GetMapping("/get")
    public ResponseEntity<?> getAll() {
        List<Map<String, Object>> jobs = jobService.getAll().stream().map(this::toJobPayload).toList();
        return ResponseEntity.ok(Map.of("jobs", jobs));
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> getById(@PathVariable("id") String jobId) {
        Job job = jobService.getById(jobId);
        return ResponseEntity.ok(Map.of("job", toJobPayload(job)));
    }

    @GetMapping("/getadminjobs")
    public ResponseEntity<?> getAdminJobs() {
        List<Map<String, Object>> jobs = jobService.getAdminJobs("loggedUserId").stream().map(this::toJobPayload).toList();
        return ResponseEntity.ok(Map.of("jobs", jobs));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable("id") String jobId, @RequestBody JobDTO dto) {
        Job updated = jobService.update(jobId, dto);
        return ResponseEntity.ok(Map.of("message", "Job updated successfully.", "job", toJobPayload(updated)));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") String jobId) {
        jobService.delete(jobId);
        return ResponseEntity.ok(Map.of("message", "Job deleted successfully."));
    }

    private Map<String, Object> toJobPayload(Job job) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("id", job.getId());
        payload.put("title", job.getTitle());
        payload.put("description", job.getDescription());
        payload.put("requirements", job.getRequirements());
        payload.put("salary", job.getSalary());
        payload.put("experienceLevel", job.getExperienceLevel());
        payload.put("location", job.getLocation());
        payload.put("jobType", job.getJobType());
        payload.put("position", job.getPosition());
        payload.put("companyId", job.getCompany());
        payload.put("createdBy", job.getCreatedBy());
        payload.put("applications", job.getApplications());
        payload.put("createdAt", job.getCreatedAt());
        return payload;
    }
}