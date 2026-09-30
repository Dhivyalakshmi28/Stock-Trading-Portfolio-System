package com.stock.stock_trading_portfolio_system.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import com.stock.stock_trading_portfolio_system.entity.Account;
import com.stock.stock_trading_portfolio_system.entity.User;
import com.stock.stock_trading_portfolio_system.repository.AccountRepository;
import com.stock.stock_trading_portfolio_system.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            UserRepository userRepository,
            AccountRepository accountRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public User register(
            String fullName,
            String email,
            String password,
            String phone) {

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already registered");
        }

        // Create user
        User user = new User();

        user.setFullName(fullName);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setPhone(phone);
        user.setRole("USER");
        user.setStatus("ACTIVE");
        user.setCreatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);

        // Create trading account automatically
        Account account = new Account();

        account.setUser(savedUser);

        // Generate unique account number
        account.setAccountNumber(
                "ACC" + UUID.randomUUID()
                        .toString()
                        .replace("-", "")
                        .substring(0, 12)
                        .toUpperCase()
        );

        // Give every new user $100,000 virtual money
        account.setCashBalance(new BigDecimal("100000.00"));

        account.setCreatedAt(LocalDateTime.now());
        account.setStatus("ACTIVE");

        accountRepository.save(account);

        return savedUser;
    }

    public User login(
            String email,
            String password) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(
                password,
                user.getPasswordHash())) {

            throw new RuntimeException("Invalid email or password");
        }

        if (!"ACTIVE".equalsIgnoreCase(user.getStatus())) {
            throw new RuntimeException("User account is inactive");
        }

        return user;
    }
}