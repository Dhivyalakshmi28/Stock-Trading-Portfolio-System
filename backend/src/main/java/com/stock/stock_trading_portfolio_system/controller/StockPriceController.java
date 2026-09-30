package com.stock.stock_trading_portfolio_system.controller;

import com.stock.stock_trading_portfolio_system.entity.StockPrice;
import com.stock.stock_trading_portfolio_system.service.StockPriceService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/stock-prices")
@CrossOrigin(origins = "${FRONTEND_URL:http://localhost:5173}")
public class StockPriceController {

    private final StockPriceService stockPriceService;

    public StockPriceController(StockPriceService stockPriceService) {
        this.stockPriceService = stockPriceService;
    }

    @GetMapping("/stock/{stockId}")
    public List<StockPrice> getHistoricalPrices(
            @PathVariable Long stockId) {

        return stockPriceService.getHistoricalPrices(stockId);
    }

    @GetMapping("/stock/{stockId}/latest")
    public StockPrice getLatestPrice(
            @PathVariable Long stockId) {

        return stockPriceService.getLatestPrice(stockId).orElse(null);
    }

    @GetMapping("/stock/{stockId}/range")
    public List<StockPrice> getPricesBetweenDates(
            @PathVariable Long stockId,
            @RequestParam LocalDateTime start,
            @RequestParam LocalDateTime end) {

        return stockPriceService.getPricesBetweenDates(
                stockId, start, end);
    }
}