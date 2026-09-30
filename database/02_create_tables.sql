-- ============================================================
-- STOCK TRADING AND PORTFOLIO MANAGEMENT SYSTEM
-- DATABASE TABLES
-- ============================================================


-- ============================================================
-- 1. USERS
-- ============================================================

CREATE TABLE users (
    user_id BIGSERIAL PRIMARY KEY,

    full_name VARCHAR(100) NOT NULL,

    email VARCHAR(150) NOT NULL UNIQUE,

    password_hash VARCHAR(255) NOT NULL,

    phone VARCHAR(20),

    role VARCHAR(20) NOT NULL DEFAULT 'USER'
        CHECK (role IN ('USER', 'ADMIN')),

    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE', 'INACTIVE')),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- 2. ACCOUNTS
-- ============================================================

CREATE TABLE accounts (
    account_id BIGSERIAL PRIMARY KEY,

    user_id BIGINT NOT NULL UNIQUE,

    account_number VARCHAR(30) NOT NULL UNIQUE,

    cash_balance NUMERIC(15,2) NOT NULL DEFAULT 0.00
        CHECK (cash_balance >= 0),

    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE', 'SUSPENDED', 'CLOSED')),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_account_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
);


-- ============================================================
-- 3. COMPANIES
-- ============================================================

CREATE TABLE companies (
    company_id BIGSERIAL PRIMARY KEY,

    company_name VARCHAR(150) NOT NULL,

    description TEXT,

    industry VARCHAR(100),

    website VARCHAR(255),

    country VARCHAR(100)
);


-- ============================================================
-- 4. EXCHANGES
-- ============================================================

CREATE TABLE exchanges (
    exchange_id BIGSERIAL PRIMARY KEY,

    exchange_name VARCHAR(100) NOT NULL UNIQUE,

    country VARCHAR(100) NOT NULL,

    currency VARCHAR(10) NOT NULL,

    timezone VARCHAR(50),

    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE', 'INACTIVE'))
);


-- ============================================================
-- 5. STOCKS
-- ============================================================

CREATE TABLE stocks (
    stock_id SERIAL PRIMARY KEY,
    symbol VARCHAR(20) UNIQUE NOT NULL,
    company_id INT REFERENCES companies(company_id),
    exchange_id INT REFERENCES exchanges(exchange_id),
    stock_name VARCHAR(100),
    listed_date DATE,
    instrument_type VARCHAR(20) NOT NULL DEFAULT 'STOCK',
    status VARCHAR(20) DEFAULT 'ACTIVE',

    CONSTRAINT chk_instrument_type
        CHECK (instrument_type IN ('STOCK', 'ETF'))


-- ============================================================
-- 6. STOCK_PRICES
-- ============================================================

CREATE TABLE stock_prices (
    price_id BIGSERIAL PRIMARY KEY,

    stock_id BIGINT NOT NULL,

    timestamp TIMESTAMP NOT NULL,

    open_price NUMERIC(15,4) NOT NULL,

    high_price NUMERIC(15,4) NOT NULL,

    low_price NUMERIC(15,4) NOT NULL,

    close_price NUMERIC(15,4) NOT NULL,

    volume BIGINT NOT NULL,

    CONSTRAINT fk_price_stock
        FOREIGN KEY (stock_id)
        REFERENCES stocks(stock_id),

    CONSTRAINT chk_price_values
        CHECK (
            open_price > 0
            AND high_price > 0
            AND low_price > 0
            AND close_price > 0
            AND volume >= 0
        ),

    CONSTRAINT chk_high_low
        CHECK (high_price >= low_price),

    CONSTRAINT uq_stock_timestamp
        UNIQUE (stock_id, timestamp)
);


-- ============================================================
-- 7. ORDERS
-- ============================================================

CREATE TABLE orders (
    order_id BIGSERIAL PRIMARY KEY,

    account_id BIGINT NOT NULL,

    stock_id BIGINT NOT NULL,

    order_type VARCHAR(10) NOT NULL
        CHECK (order_type IN ('BUY', 'SELL')),

    quantity INTEGER NOT NULL
        CHECK (quantity > 0),

    order_price NUMERIC(15,4) NOT NULL
        CHECK (order_price > 0),

    order_status VARCHAR(20) NOT NULL DEFAULT 'PENDING'
        CHECK (
            order_status IN
            ('PENDING', 'EXECUTED', 'CANCELLED', 'REJECTED')
        ),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_order_account
        FOREIGN KEY (account_id)
        REFERENCES accounts(account_id),

    CONSTRAINT fk_order_stock
        FOREIGN KEY (stock_id)
        REFERENCES stocks(stock_id)
);


-- ============================================================
-- 8. TRADES
-- ============================================================

CREATE TABLE trades (
    trade_id BIGSERIAL PRIMARY KEY,

    order_id BIGINT NOT NULL UNIQUE,

    quantity INTEGER NOT NULL
        CHECK (quantity > 0),

    execution_price NUMERIC(15,4) NOT NULL
        CHECK (execution_price > 0),

    executed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_trade_order
        FOREIGN KEY (order_id)
        REFERENCES orders(order_id)
);


-- ============================================================
-- 9. HOLDINGS
-- ============================================================

CREATE TABLE holdings (
    holding_id BIGSERIAL PRIMARY KEY,

    account_id BIGINT NOT NULL,

    stock_id BIGINT NOT NULL,

    quantity INTEGER NOT NULL
        CHECK (quantity >= 0),

    average_buy_price NUMERIC(15,4) NOT NULL
        CHECK (average_buy_price >= 0),

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_holding_account
        FOREIGN KEY (account_id)
        REFERENCES accounts(account_id),

    CONSTRAINT fk_holding_stock
        FOREIGN KEY (stock_id)
        REFERENCES stocks(stock_id),

    CONSTRAINT uq_account_stock
        UNIQUE (account_id, stock_id)
);


-- ============================================================
-- 10. TRANSACTIONS
-- ============================================================

CREATE TABLE transactions (
    transaction_id BIGSERIAL PRIMARY KEY,

    account_id BIGINT NOT NULL,

    order_id BIGINT,

    transaction_type VARCHAR(20) NOT NULL
        CHECK (
            transaction_type IN
            ('DEPOSIT', 'WITHDRAWAL', 'BUY', 'SELL')
        ),

    amount NUMERIC(15,2) NOT NULL
        CHECK (amount > 0),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_transaction_account
        FOREIGN KEY (account_id)
        REFERENCES accounts(account_id),

    CONSTRAINT fk_transaction_order
        FOREIGN KEY (order_id)
        REFERENCES orders(order_id)
);


-- ============================================================
-- 11. WATCHLISTS
-- ============================================================

CREATE TABLE watchlists (
    watchlist_id BIGSERIAL PRIMARY KEY,

    user_id BIGINT NOT NULL,

    watchlist_name VARCHAR(100) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_watchlist_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
);


-- ============================================================
-- 12. WATCHLIST_ITEMS
-- ============================================================

CREATE TABLE watchlist_items (
    watchlist_item_id BIGSERIAL PRIMARY KEY,

    watchlist_id BIGINT NOT NULL,

    stock_id BIGINT NOT NULL,

    added_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_watchlist_item_watchlist
        FOREIGN KEY (watchlist_id)
        REFERENCES watchlists(watchlist_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_watchlist_item_stock
        FOREIGN KEY (stock_id)
        REFERENCES stocks(stock_id),

    CONSTRAINT uq_watchlist_stock
        UNIQUE (watchlist_id, stock_id)
);