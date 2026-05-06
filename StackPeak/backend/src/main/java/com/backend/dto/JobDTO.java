package com.backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class JobDTO {

    private String title;
    private String description;
    private List<String> requirements;

    private Double salary;
    private Integer experienceLevel;
    private String location;
    private String jobType;
    private Integer position;
    private String companyId;
}