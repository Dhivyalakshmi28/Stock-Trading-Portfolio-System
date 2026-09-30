package com.stock.stock_trading_portfolio_system.service;

import com.stock.stock_trading_portfolio_system.entity.Company;
import com.stock.stock_trading_portfolio_system.repository.CompanyRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;

    public CompanyService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    public Optional<Company> getCompanyById(Long companyId) {
        return companyRepository.findById(companyId);
    }

    public Optional<Company> getCompanyByName(String companyName) {
        return companyRepository.findByCompanyName(companyName);
    }

    public Company saveCompany(Company company) {
        return companyRepository.save(company);
    }
}