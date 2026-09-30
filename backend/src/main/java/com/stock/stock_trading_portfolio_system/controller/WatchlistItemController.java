package com.stock.stock_trading_portfolio_system.controller;

import com.stock.stock_trading_portfolio_system.entity.WatchlistItem;
import com.stock.stock_trading_portfolio_system.service.WatchlistItemService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/watchlist-items")
@CrossOrigin(origins = "${FRONTEND_URL:http://localhost:5173}")
public class WatchlistItemController {

    private final WatchlistItemService watchlistItemService;

    public WatchlistItemController(WatchlistItemService watchlistItemService) {
        this.watchlistItemService = watchlistItemService;
    }

    @GetMapping("/watchlist/{watchlistId}")
    public List<WatchlistItem> getItemsByWatchlist(
            @PathVariable Long watchlistId) {

        return watchlistItemService
                .getItemsByWatchlist(watchlistId);
    }

    @GetMapping("/watchlist/{watchlistId}/stock/{stockId}/exists")
    public boolean stockAlreadyInWatchlist(
            @PathVariable Long watchlistId,
            @PathVariable Long stockId) {

        return watchlistItemService
                .stockAlreadyInWatchlist(watchlistId, stockId);
    }

    @PostMapping
    public WatchlistItem addToWatchlist(
            @RequestBody WatchlistItem item) {

        return watchlistItemService.saveItem(item);
    }

    @DeleteMapping("/{id}")
    public void removeFromWatchlist(
            @PathVariable Long id) {

        watchlistItemService.deleteItem(id);
    }
}