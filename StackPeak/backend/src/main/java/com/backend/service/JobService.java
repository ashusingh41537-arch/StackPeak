package com.backend.service;

import com.backend.dto.JobDTO;
import com.backend.model.Job;
import com.backend.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;

    public Job create(JobDTO dto, String userId) {

        Job job = new Job();
        job.setTitle(dto.getTitle());
        job.setDescription(dto.getDescription());
        job.setRequirements(dto.getRequirements() == null ? List.of() : dto.getRequirements());
        job.setSalary(dto.getSalary());
        job.setExperienceLevel(dto.getExperienceLevel());
        job.setLocation(dto.getLocation());
        job.setJobType(dto.getJobType());
        job.setPosition(dto.getPosition());
        job.setCompany(dto.getCompanyId());
        job.setCreatedBy(userId);

        return jobRepository.save(job);
    }

    public Job getById(String jobId) {
        return jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
    }

    public List<Job> getAdminJobs(String userId) {
        return jobRepository.findByCreatedBy(userId);
    }

    public List<Job> getAll() {
        return jobRepository.findAll();
    }

    public Job update(String jobId, JobDTO dto) {
        Job job = getById(jobId);

        if (dto.getTitle() != null) {
            job.setTitle(dto.getTitle());
        }
        if (dto.getDescription() != null) {
            job.setDescription(dto.getDescription());
        }
        if (dto.getRequirements() != null) {
            job.setRequirements(dto.getRequirements());
        }
        if (dto.getSalary() != null) {
            job.setSalary(dto.getSalary());
        }
        if (dto.getExperienceLevel() != null) {
            job.setExperienceLevel(dto.getExperienceLevel());
        }
        if (dto.getLocation() != null) {
            job.setLocation(dto.getLocation());
        }
        if (dto.getJobType() != null) {
            job.setJobType(dto.getJobType());
        }
        if (dto.getPosition() != null) {
            job.setPosition(dto.getPosition());
        }
        if (dto.getCompanyId() != null) {
            job.setCompany(dto.getCompanyId());
        }

        return jobRepository.save(job);
    }

    public void delete(String jobId) {
        Job job = getById(jobId);
        jobRepository.delete(job);
    }
}