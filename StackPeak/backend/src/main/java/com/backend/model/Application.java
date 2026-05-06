package com.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Document(collection = "applications")
public class Application {

    @Id
    private String id;

    // job id
    private String job;

    // user id
    private String applicant;

    private String status = "pending";

    private Instant createdAt = Instant.now();
}
