package com.stock.stock_trading_portfolio_system.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "watchlist_items",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_watchlist_items_watchlist_stock",
            columnNames = {"watchlist_id", "stock_id"}
        )
    }
)
public class WatchlistItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "watchlist_item_id")
    private Long watchlistItemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "watchlist_id", nullable = false)
    private Watchlist watchlist;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stock_id", nullable = false)
    private Stock stock;

    @Column(name = "added_at", nullable = false)
    private LocalDateTime addedAt;

    public WatchlistItem() {
    }

    public Long getWatchlistItemId() {
        return watchlistItemId;
    }

    public void setWatchlistItemId(Long watchlistItemId) {
        this.watchlistItemId = watchlistItemId;
    }

    public Watchlist getWatchlist() {
        return watchlist;
    }

    public void setWatchlist(Watchlist watchlist) {
        this.watchlist = watchlist;
    }

    public Stock getStock() {
        return stock;
    }

    public void setStock(Stock stock) {
        this.stock = stock;
    }

    public LocalDateTime getAddedAt() {
        return addedAt;
    }

    public void setAddedAt(LocalDateTime addedAt) {
        this.addedAt = addedAt;
    }
}