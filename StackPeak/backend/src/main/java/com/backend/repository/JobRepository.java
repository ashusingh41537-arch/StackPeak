package com.backend.repository;

import com.backend.model.Job;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface JobRepository extends MongoRepository<Job, String> {

    List<Job> findByCreatedBy(String createdBy);
}