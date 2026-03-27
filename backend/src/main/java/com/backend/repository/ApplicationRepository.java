package com.backend.repository;

import com.backend.model.Application;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends MongoRepository<Application, String> {

    Optional<Application> findByJobAndApplicant(String job, String applicant);

    List<Application> findByApplicant(String applicant);

    List<Application> findByJob(String job);
}