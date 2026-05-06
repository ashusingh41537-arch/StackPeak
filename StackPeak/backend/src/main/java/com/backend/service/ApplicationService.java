package com.backend.service;

import com.backend.model.Application;
import com.backend.model.Company;
import com.backend.model.Job;
import com.backend.model.User;
import com.backend.repository.ApplicationRepository;
import com.backend.repository.CompanyRepository;
import com.backend.repository.JobRepository;
import com.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;

    public Application apply(String jobId, String userId) {

        if (applicationRepository.findByJobAndApplicant(jobId, userId).isPresent()) {
            throw new RuntimeException("Already applied");
        }

        Application app = new Application();
        app.setJob(jobId);
        app.setApplicant(userId);

        return applicationRepository.save(app);
    }

    public List<Map<String, Object>> getMyApplications(String userId) {
        return applicationRepository.findByApplicant(userId)
                .stream()
                .map(this::toApplicationPayloadForCandidate)
                .toList();
    }

    public List<Map<String, Object>> getApplicantsByJob(String jobId) {
        return applicationRepository.findByJob(jobId)
                .stream()
                .map(this::toApplicationPayloadForAdmin)
                .toList();
    }

    public Application updateStatus(String applicationId, String status) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        String normalized = normalizeStatus(status);
        if (!normalized.equals("pending") && !normalized.equals("shortlisted") && !normalized.equals("rejected")) {
            throw new RuntimeException("Invalid status");
        }

        application.setStatus(normalized);
        return applicationRepository.save(application);
    }

    private String normalizeStatus(String value) {
        return value == null ? "" : value.trim().toLowerCase();
    }

    private Map<String, Object> toApplicationPayloadForCandidate(Application application) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("id", application.getId());
        payload.put("status", application.getStatus());
        payload.put("createdAt", application.getCreatedAt());
        payload.put("job", toJobPayload(application.getJob()));
        return payload;
    }

    private Map<String, Object> toApplicationPayloadForAdmin(Application application) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("id", application.getId());
        payload.put("status", application.getStatus());
        payload.put("createdAt", application.getCreatedAt());
        payload.put("jobId", application.getJob());
        payload.put("applicant", toApplicantPayload(application.getApplicant()));
        return payload;
    }

    private Map<String, Object> toApplicantPayload(String applicantId) {
        User user = userRepository.findById(applicantId).orElse(null);
        if (user == null) {
            return null;
        }

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("id", user.getId());
        payload.put("fullName", user.getFullname());
        payload.put("email", user.getEmail());
        payload.put("phoneNumber", user.getPhoneNumber());
        payload.put("role", user.getRole());
        return payload;
    }

    private Map<String, Object> toJobPayload(String jobId) {
        Job job = jobRepository.findById(jobId).orElse(null);
        if (job == null) {
            return null;
        }

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("id", job.getId());
        payload.put("title", job.getTitle());
        payload.put("location", job.getLocation());
        payload.put("jobType", job.getJobType());
        payload.put("salary", job.getSalary());

        Company company = companyRepository.findById(job.getCompany()).orElse(null);
        if (company != null) {
            payload.put("company", Map.of("id", company.getId(), "name", company.getName()));
        }

        return payload;
    }
}