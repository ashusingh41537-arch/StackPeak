package com.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Data
@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String fullname;
    private String email;
    private String phoneNumber;
    private String password;
    private String role;

    private Profile profile;

    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();

    @Data
    public static class Profile {
        private String bio;
        private List<String> skills;
        private String resume;
        private String resumeOriginalName;
        private String company;
        private String profilePhoto;
    }
}
