package com.stock.stock_trading_portfolio_system.controller;

import com.stock.stock_trading_portfolio_system.entity.Order;
import com.stock.stock_trading_portfolio_system.service.TradingService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trading")
@CrossOrigin(origins = {
        "http://localhost:5173"
})
public class TradingController {

    private final TradingService tradingService;

    public TradingController(TradingService tradingService) {
        this.tradingService = tradingService;
    }

    @PostMapping("/execute")
    public Order executeTrade(
            @RequestParam Long accountId,
            @RequestParam Long stockId,
            @RequestParam String orderType,
            @RequestParam Integer quantity) {

        return tradingService.executeTrade(
                accountId,
                stockId,
                orderType,
                quantity
        );
    }
}