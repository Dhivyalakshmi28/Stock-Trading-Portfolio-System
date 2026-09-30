package com.stock.stock_trading_portfolio_system.service;

import com.stock.stock_trading_portfolio_system.entity.Transaction;
import com.stock.stock_trading_portfolio_system.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;

    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public List<Transaction> getTransactionsByAccount(Long accountId) {
        return transactionRepository
                .findByAccountAccountIdOrderByCreatedAtDesc(accountId);
    }

    public List<Transaction> getTransactionsByType(String transactionType) {
        return transactionRepository
                .findByTransactionType(transactionType);
    }

    public Optional<Transaction> getTransactionById(Long transactionId) {
        return transactionRepository.findById(transactionId);
    }

    public Transaction saveTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }
}