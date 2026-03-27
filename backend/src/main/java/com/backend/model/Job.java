package com.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Data
@Document(collection = "jobs")
public class Job {

    @Id
    private String id;

    private String title;
    private String description;

    private List<String> requirements;

    private Double salary;
    private Integer experienceLevel;
    private String location;
    private String jobType;
    private Integer position;

    // company id
    private String company;

    // admin id
    private String createdBy;

    // application ids
    private List<String> applications;

    private Instant createdAt = Instant.now();
}
