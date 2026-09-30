-- ============================================================
-- STOCK TRADING AND PORTFOLIO MANAGEMENT SYSTEM
-- DATABASE INDEXES
-- ============================================================


-- Quickly find stock price history
CREATE INDEX idx_stock_prices_stock_time
ON stock_prices(stock_id, timestamp DESC);


-- Quickly retrieve orders belonging to an account
CREATE INDEX idx_orders_account
ON orders(account_id);


-- Quickly retrieve orders for a particular stock
CREATE INDEX idx_orders_stock
ON orders(stock_id);


-- Quickly retrieve transactions for an account
CREATE INDEX idx_transactions_account
ON transactions(account_id);


-- Quickly retrieve holdings for an account
CREATE INDEX idx_holdings_account
ON holdings(account_id);


-- Quickly retrieve watchlist items
CREATE INDEX idx_watchlist_items_watchlist
ON watchlist_items(watchlist_id);


-- Quickly retrieve watchlists belonging to a user
CREATE INDEX idx_watchlists_user
ON watchlists(user_id);