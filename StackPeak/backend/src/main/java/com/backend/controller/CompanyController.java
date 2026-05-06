package com.backend.controller;

import com.backend.dto.CompanyDTO;
import com.backend.model.Company;
import com.backend.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/company")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody CompanyDTO dto) {

        Company company = companyService.register(dto, "loggedUserId");

        return ResponseEntity.status(201)
                .body(Map.of("message", "Company registered successfully.", "company", company));
    }

    @GetMapping("/get")
    public ResponseEntity<?> getCompanies() {
        List<Company> companies = companyService.getAll();
        return ResponseEntity.ok(Map.of("companies", companies));
    }

    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateCompany(
            @PathVariable("id") String companyId,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "website", required = false) String website,
            @RequestParam(value = "location", required = false) String location,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) {
        CompanyDTO dto = new CompanyDTO();
        dto.setName(name);
        dto.setDescription(description);
        dto.setWebsite(website);
        dto.setLocation(location);
        dto.setLogo(file != null && !file.isEmpty() ? file.getOriginalFilename() : null);

        Company updated = companyService.update(companyId, dto);
        return ResponseEntity.ok(Map.of("message", "Company updated successfully.", "company", updated));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteCompany(@PathVariable("id") String companyId) {
        companyService.delete(companyId);
        return ResponseEntity.ok(Map.of("message", "Company deleted successfully."));
    }
}