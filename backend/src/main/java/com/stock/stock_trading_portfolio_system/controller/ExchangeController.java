package com.stock.stock_trading_portfolio_system.controller;

import com.stock.stock_trading_portfolio_system.entity.Exchange;
import com.stock.stock_trading_portfolio_system.service.ExchangeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exchanges")

public class ExchangeController {

    private final ExchangeService exchangeService;

    public ExchangeController(ExchangeService exchangeService) {
        this.exchangeService = exchangeService;
    }

    @GetMapping
    public List<Exchange> getAllExchanges() {
        return exchangeService.getAllExchanges();
    }

    @GetMapping("/{id}")
    public Exchange getExchangeById(@PathVariable Long id) {
        return exchangeService.getExchangeById(id).orElse(null);
    }

    @GetMapping("/name/{name}")
    public Exchange getExchangeByName(@PathVariable String name) {
        return exchangeService.getExchangeByName(name).orElse(null);
    }

    @PostMapping
    public Exchange createExchange(@RequestBody Exchange exchange) {
        return exchangeService.saveExchange(exchange);
    }
}