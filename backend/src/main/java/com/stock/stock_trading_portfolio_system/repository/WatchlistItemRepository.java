package com.stock.stock_trading_portfolio_system.repository;

import com.stock.stock_trading_portfolio_system.entity.WatchlistItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WatchlistItemRepository extends JpaRepository<WatchlistItem, Long> {

    List<WatchlistItem> findByWatchlistWatchlistId(Long watchlistId);

    boolean existsByWatchlistWatchlistIdAndStockStockId(
            Long watchlistId,
            Long stockId
    );
}