package com.stock.stock_trading_portfolio_system.service;

import com.stock.stock_trading_portfolio_system.entity.Account;
import com.stock.stock_trading_portfolio_system.repository.AccountRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AccountService {

    private final AccountRepository accountRepository;

    public AccountService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    public Optional<Account> getAccountById(Long accountId) {
        return accountRepository.findById(accountId);
    }

    public Optional<Account> getAccountByNumber(String accountNumber) {
        return accountRepository.findByAccountNumber(accountNumber);
    }

    public Optional<Account> getAccountByUserId(Long userId) {
        return accountRepository.findByUserUserId(userId);
    }

    public Account saveAccount(Account account) {
        return accountRepository.save(account);
    }
}