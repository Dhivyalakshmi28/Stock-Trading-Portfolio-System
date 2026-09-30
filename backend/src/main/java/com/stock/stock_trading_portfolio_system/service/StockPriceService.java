package com.stock.stock_trading_portfolio_system.service;

import com.stock.stock_trading_portfolio_system.entity.StockPrice;
import com.stock.stock_trading_portfolio_system.repository.StockPriceRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class StockPriceService {

    private final StockPriceRepository stockPriceRepository;

    public StockPriceService(StockPriceRepository stockPriceRepository) {
        this.stockPriceRepository = stockPriceRepository;
    }

    public List<StockPrice> getHistoricalPrices(Long stockId) {
        return stockPriceRepository
                .findByStockStockIdOrderByTimestampAsc(stockId);
    }

    public Optional<StockPrice> getLatestPrice(Long stockId) {
        return stockPriceRepository
                .findTopByStockStockIdOrderByTimestampDesc(stockId);
    }

    public List<StockPrice> getPricesBetweenDates(
            Long stockId,
            LocalDateTime start,
            LocalDateTime end) {

        return stockPriceRepository
                .findByStockStockIdAndTimestampBetweenOrderByTimestampAsc(
                        stockId, start, end);
    }

    public StockPrice savePrice(StockPrice stockPrice) {
        return stockPriceRepository.save(stockPrice);
    }
}