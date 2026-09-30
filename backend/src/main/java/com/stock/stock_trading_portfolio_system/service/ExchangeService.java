package com.stock.stock_trading_portfolio_system.service;

import com.stock.stock_trading_portfolio_system.entity.Exchange;
import com.stock.stock_trading_portfolio_system.repository.ExchangeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ExchangeService {

    private final ExchangeRepository exchangeRepository;

    public ExchangeService(ExchangeRepository exchangeRepository) {
        this.exchangeRepository = exchangeRepository;
    }

    public List<Exchange> getAllExchanges() {
        return exchangeRepository.findAll();
    }

    public Optional<Exchange> getExchangeById(Long exchangeId) {
        return exchangeRepository.findById(exchangeId);
    }

    public Optional<Exchange> getExchangeByName(String exchangeName) {
        return exchangeRepository.findByExchangeName(exchangeName);
    }

    public Exchange saveExchange(Exchange exchange) {
        return exchangeRepository.save(exchange);
    }
}