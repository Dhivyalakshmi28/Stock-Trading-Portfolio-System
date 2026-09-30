package com.stock.stock_trading_portfolio_system.repository;

import com.stock.stock_trading_portfolio_system.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {

    Optional<Account> findByAccountNumber(String accountNumber);

    Optional<Account> findByUserUserId(Long userId);
}