package com.stock.stock_trading_portfolio_system.controller;

import com.stock.stock_trading_portfolio_system.entity.Transaction;
import com.stock.stock_trading_portfolio_system.service.TransactionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:5173")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping("/account/{accountId}")
    public List<Transaction> getTransactionsByAccount(
            @PathVariable Long accountId) {

        return transactionService
                .getTransactionsByAccount(accountId);
    }

    @GetMapping("/type/{type}")
    public List<Transaction> getTransactionsByType(
            @PathVariable String type) {

        return transactionService
                .getTransactionsByType(type);
    }

    @GetMapping("/{id}")
    public Transaction getTransactionById(
            @PathVariable Long id) {

        return transactionService
                .getTransactionById(id)
                .orElse(null);
    }
}