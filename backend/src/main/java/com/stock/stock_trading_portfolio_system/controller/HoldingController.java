package com.stock.stock_trading_portfolio_system.controller;

import com.stock.stock_trading_portfolio_system.entity.Holding;
import com.stock.stock_trading_portfolio_system.service.HoldingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/holdings")

public class HoldingController {

    private final HoldingService holdingService;

    public HoldingController(HoldingService holdingService) {
        this.holdingService = holdingService;
    }

    @GetMapping("/account/{accountId}")
    public List<Holding> getHoldingsByAccount(
            @PathVariable Long accountId) {

        return holdingService.getHoldingsByAccount(accountId);
    }

    @GetMapping("/account/{accountId}/stock/{stockId}")
    public Holding getHolding(
            @PathVariable Long accountId,
            @PathVariable Long stockId) {

        return holdingService
                .getHolding(accountId, stockId)
                .orElse(null);
    }

    @GetMapping("/{id}")
    public Holding getHoldingById(@PathVariable Long id) {

        return holdingService
                .getHoldingById(id)
                .orElse(null);
    }
}