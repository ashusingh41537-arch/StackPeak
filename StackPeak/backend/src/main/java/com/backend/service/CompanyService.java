package com.backend.service;

import com.backend.dto.CompanyDTO;
import com.backend.model.Company;
import com.backend.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;

    public Company register(CompanyDTO dto, String userId) {

        Company company = new Company();
        company.setName(dto.getName());
        company.setDescription(dto.getDescription());
        company.setWebsite(dto.getWebsite());
        company.setLocation(dto.getLocation());
        company.setLogo(dto.getLogo());
        company.setUserId(userId);

        return companyRepository.save(company);
    }

    public List<Company> getByUser(String userId) {
        return companyRepository.findByUserId(userId);
    }

    public List<Company> getAll() {
        return companyRepository.findAll();
    }

    public Company update(String companyId, CompanyDTO dto) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        if (dto.getName() != null && !dto.getName().isBlank()) {
            company.setName(dto.getName().trim());
        }

        if (dto.getDescription() != null) {
            company.setDescription(dto.getDescription().trim());
        }

        if (dto.getWebsite() != null) {
            company.setWebsite(dto.getWebsite().trim());
        }

        if (dto.getLocation() != null) {
            company.setLocation(dto.getLocation().trim());
        }

        if (dto.getLogo() != null) {
            company.setLogo(dto.getLogo().trim());
        }

        return companyRepository.save(company);
    }

    public void delete(String companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));
        companyRepository.delete(company);
    }
}