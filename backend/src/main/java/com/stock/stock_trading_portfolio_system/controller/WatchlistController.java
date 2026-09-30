package com.stock.stock_trading_portfolio_system.controller;

import com.stock.stock_trading_portfolio_system.entity.Watchlist;
import com.stock.stock_trading_portfolio_system.service.WatchlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/watchlists")
@CrossOrigin(origins = "http://localhost:5173")
public class WatchlistController {

    private final WatchlistService watchlistService;

    public WatchlistController(WatchlistService watchlistService) {
        this.watchlistService = watchlistService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Watchlist>> getByUser(
            @PathVariable Long userId
    ) {
        return ResponseEntity.ok(
                watchlistService.getWatchlistsByUser(userId)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Watchlist> getById(
            @PathVariable Long id
    ) {
        return watchlistService.getWatchlistById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.notFound().build()
                );
    }

    @PostMapping
    public ResponseEntity<Watchlist> create(
            @RequestBody Watchlist watchlist
    ) {
        return ResponseEntity.ok(
                watchlistService.saveWatchlist(watchlist)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id
    ) {
        watchlistService.deleteWatchlist(id);
        return ResponseEntity.noContent().build();
    }
}