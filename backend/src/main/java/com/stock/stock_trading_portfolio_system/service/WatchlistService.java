package com.stock.stock_trading_portfolio_system.service;

import com.stock.stock_trading_portfolio_system.entity.Watchlist;
import com.stock.stock_trading_portfolio_system.repository.WatchlistRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WatchlistService {

    private final WatchlistRepository watchlistRepository;

    public WatchlistService(WatchlistRepository watchlistRepository) {
        this.watchlistRepository = watchlistRepository;
    }

    public List<Watchlist> getWatchlistsByUser(Long userId) {
        return watchlistRepository.findByUserUserId(userId);
    }

    public Optional<Watchlist> getWatchlistById(Long watchlistId) {
        return watchlistRepository.findById(watchlistId);
    }

    public Watchlist saveWatchlist(Watchlist watchlist) {
        return watchlistRepository.save(watchlist);
    }

    public void deleteWatchlist(Long watchlistId) {
        watchlistRepository.deleteById(watchlistId);
    }
}