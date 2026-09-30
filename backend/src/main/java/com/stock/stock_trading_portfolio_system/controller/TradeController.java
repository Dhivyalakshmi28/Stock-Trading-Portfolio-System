package com.stock.stock_trading_portfolio_system.controller;

import com.stock.stock_trading_portfolio_system.entity.Trade;
import com.stock.stock_trading_portfolio_system.service.TradeService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trades")
@CrossOrigin(origins = "http://localhost:5173")
public class TradeController {

    private final TradeService tradeService;

    public TradeController(TradeService tradeService) {
        this.tradeService = tradeService;
    }

    @GetMapping("/{id}")
    public Trade getTradeById(@PathVariable Long id) {
        return tradeService.getTradeById(id).orElse(null);
    }

    @GetMapping("/order/{orderId}")
    public Trade getTradeByOrderId(@PathVariable Long orderId) {
        return tradeService.getTradeByOrderId(orderId).orElse(null);
    }

    @PostMapping
    public Trade createTrade(@RequestBody Trade trade) {
        return tradeService.saveTrade(trade);
    }
}