package com.stock.stock_trading_portfolio_system.repository;

import com.stock.stock_trading_portfolio_system.entity.StockPrice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface StockPriceRepository extends JpaRepository<StockPrice, Long> {

    List<StockPrice> findByStockStockIdOrderByTimestampAsc(Long stockId);

    Optional<StockPrice> findTopByStockStockIdOrderByTimestampDesc(Long stockId);

    List<StockPrice> findByStockStockIdAndTimestampBetweenOrderByTimestampAsc(
            Long stockId,
            LocalDateTime start,
            LocalDateTime end
    );
}