package com.stock.stock_trading_portfolio_system.controller;

import com.stock.stock_trading_portfolio_system.entity.Account;
import com.stock.stock_trading_portfolio_system.service.AccountService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "${FRONTEND_URL:http://localhost:5173}")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping("/{id}")
    public Account getAccountById(@PathVariable Long id) {
        return accountService.getAccountById(id).orElse(null);
    }

    @GetMapping("/number/{accountNumber}")
    public Account getAccountByNumber(
            @PathVariable String accountNumber) {

        return accountService
                .getAccountByNumber(accountNumber)
                .orElse(null);
    }

    @GetMapping("/user/{userId}")
    public Account getAccountByUserId(@PathVariable Long userId) {

        return accountService
                .getAccountByUserId(userId)
                .orElse(null);
    }

    @PostMapping
    public Account createAccount(@RequestBody Account account) {
        return accountService.saveAccount(account);
    }
}