package com.stock.stock_trading_portfolio_system.service;

import com.stock.stock_trading_portfolio_system.entity.WatchlistItem;
import com.stock.stock_trading_portfolio_system.repository.WatchlistItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WatchlistItemService {

    private final WatchlistItemRepository watchlistItemRepository;

    public WatchlistItemService(WatchlistItemRepository watchlistItemRepository) {
        this.watchlistItemRepository = watchlistItemRepository;
    }

    public List<WatchlistItem> getItemsByWatchlist(Long watchlistId) {
        return watchlistItemRepository
                .findByWatchlistWatchlistId(watchlistId);
    }

    public boolean stockAlreadyInWatchlist(Long watchlistId, Long stockId) {
        return watchlistItemRepository
                .existsByWatchlistWatchlistIdAndStockStockId(
                        watchlistId, stockId);
    }

    public WatchlistItem saveItem(WatchlistItem item) {
        return watchlistItemRepository.save(item);
    }

    public void deleteItem(Long itemId) {
        watchlistItemRepository.deleteById(itemId);
    }
}