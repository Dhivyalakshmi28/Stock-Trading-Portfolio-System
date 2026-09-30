-- ============================================================
-- STOCK TRADING AND PORTFOLIO MANAGEMENT SYSTEM
-- SAMPLE / TEST DATA
-- ============================================================


-- ============================================================
-- 1. USERS
-- ============================================================

INSERT INTO users
    (full_name, email, password_hash, phone, role, status)
VALUES
    (
        'Alice Johnson',
        'alice@example.com',
        'sample_hash_alice',
        '9876543210',
        'USER',
        'ACTIVE'
    ),
    (
        'Bob Smith',
        'bob@example.com',
        'sample_hash_bob',
        '9876543211',
        'USER',
        'ACTIVE'
    ),
    (
        'Admin User',
        'admin@example.com',
        'sample_hash_admin',
        '9876543212',
        'ADMIN',
        'ACTIVE'
    );


-- ============================================================
-- 2. ACCOUNTS
-- ============================================================

INSERT INTO accounts
    (user_id, account_number, cash_balance, status)
VALUES
    (
        (SELECT user_id FROM users
         WHERE email = 'alice@example.com'),
        'ACC10001',
        100000.00,
        'ACTIVE'
    ),
    (
        (SELECT user_id FROM users
         WHERE email = 'bob@example.com'),
        'ACC10002',
        50000.00,
        'ACTIVE'
    );


-- ============================================================
-- 3. COMPANIES
-- ============================================================

INSERT INTO companies
    (company_name, description, industry, website, country)
VALUES
    (
        'Apple Inc.',
        'Technology company producing consumer electronics and software.',
        'Technology',
        'https://www.apple.com',
        'USA'
    ),
    (
        'Microsoft Corporation',
        'Technology company producing software, cloud services and hardware.',
        'Technology',
        'https://www.microsoft.com',
        'USA'
    ),
    (
        'NVIDIA Corporation',
        'Semiconductor and computing technology company.',
        'Semiconductors',
        'https://www.nvidia.com',
        'USA'
    );


-- ============================================================
-- 4. EXCHANGES
-- ============================================================

INSERT INTO exchanges
    (exchange_name, country, currency, timezone, status)
VALUES
    (
        'NASDAQ',
        'USA',
        'USD',
        'America/New_York',
        'ACTIVE'
    ),
    (
        'NYSE',
        'USA',
        'USD',
        'America/New_York',
        'ACTIVE'
    );


-- ============================================================
-- 5. STOCKS
-- ============================================================

INSERT INTO stocks
    (symbol, company_id, exchange_id, stock_name, listed_date, status)
VALUES
    (
        'AAPL',
        (SELECT company_id FROM companies
         WHERE company_name = 'Apple Inc.'),
        (SELECT exchange_id FROM exchanges
         WHERE exchange_name = 'NASDAQ'),
        'Apple Inc.',
        '1980-12-12',
        'ACTIVE'
    ),
    (
        'MSFT',
        (SELECT company_id FROM companies
         WHERE company_name = 'Microsoft Corporation'),
        (SELECT exchange_id FROM exchanges
         WHERE exchange_name = 'NASDAQ'),
        'Microsoft Corporation',
        '1986-03-13',
        'ACTIVE'
    ),
    (
        'NVDA',
        (SELECT company_id FROM companies
         WHERE company_name = 'NVIDIA Corporation'),
        (SELECT exchange_id FROM exchanges
         WHERE exchange_name = 'NASDAQ'),
        'NVIDIA Corporation',
        '1999-01-22',
        'ACTIVE'
    );


-- ============================================================
-- 6. STOCK PRICE HISTORY
-- ============================================================

INSERT INTO stock_prices
    (
        stock_id,
        timestamp,
        open_price,
        high_price,
        low_price,
        close_price,
        volume
    )
VALUES

-- AAPL
(
    (SELECT stock_id FROM stocks WHERE symbol = 'AAPL'),
    '2026-08-25 09:30:00',
    228.00,
    231.50,
    226.80,
    230.75,
    52000000
),
(
    (SELECT stock_id FROM stocks WHERE symbol = 'AAPL'),
    '2026-08-26 09:30:00',
    230.75,
    233.20,
    229.10,
    232.40,
    48000000
),
(
    (SELECT stock_id FROM stocks WHERE symbol = 'AAPL'),
    '2026-08-27 09:30:00',
    232.40,
    234.00,
    230.50,
    231.20,
    51000000
),

-- MSFT
(
    (SELECT stock_id FROM stocks WHERE symbol = 'MSFT'),
    '2026-08-25 09:30:00',
    505.00,
    510.50,
    502.20,
    508.75,
    21000000
),
(
    (SELECT stock_id FROM stocks WHERE symbol = 'MSFT'),
    '2026-08-26 09:30:00',
    508.75,
    513.00,
    506.00,
    511.80,
    19000000
),
(
    (SELECT stock_id FROM stocks WHERE symbol = 'MSFT'),
    '2026-08-27 09:30:00',
    511.80,
    515.20,
    509.50,
    514.60,
    22000000
),

-- NVDA
(
    (SELECT stock_id FROM stocks WHERE symbol = 'NVDA'),
    '2026-08-25 09:30:00',
    175.00,
    180.50,
    173.20,
    179.80,
    75000000
),
(
    (SELECT stock_id FROM stocks WHERE symbol = 'NVDA'),
    '2026-08-26 09:30:00',
    179.80,
    184.00,
    178.50,
    182.90,
    69000000
),
(
    (SELECT stock_id FROM stocks WHERE symbol = 'NVDA'),
    '2026-08-27 09:30:00',
    182.90,
    186.50,
    181.00,
    185.70,
    72000000
);


-- ============================================================
-- 7. WATCHLISTS
-- ============================================================

INSERT INTO watchlists
    (user_id, watchlist_name)
VALUES
(
    (SELECT user_id FROM users
     WHERE email = 'alice@example.com'),
    'Technology Stocks'
),
(
    (SELECT user_id FROM users
     WHERE email = 'alice@example.com'),
    'My Favorites'
),
(
    (SELECT user_id FROM users
     WHERE email = 'bob@example.com'),
    'Growth Stocks'
);


-- ============================================================
-- 8. WATCHLIST ITEMS
-- ============================================================

INSERT INTO watchlist_items
    (watchlist_id, stock_id)
VALUES
(
    (
        SELECT watchlist_id
        FROM watchlists
        WHERE watchlist_name = 'Technology Stocks'
          AND user_id = (
              SELECT user_id
              FROM users
              WHERE email = 'alice@example.com'
          )
    ),
    (SELECT stock_id FROM stocks WHERE symbol = 'AAPL')
),
(
    (
        SELECT watchlist_id
        FROM watchlists
        WHERE watchlist_name = 'Technology Stocks'
          AND user_id = (
              SELECT user_id
              FROM users
              WHERE email = 'alice@example.com'
          )
    ),
    (SELECT stock_id FROM stocks WHERE symbol = 'MSFT')
),
(
    (
        SELECT watchlist_id
        FROM watchlists
        WHERE watchlist_name = 'My Favorites'
          AND user_id = (
              SELECT user_id
              FROM users
              WHERE email = 'alice@example.com'
          )
    ),
    (SELECT stock_id FROM stocks WHERE symbol = 'NVDA')
),
(
    (
        SELECT watchlist_id
        FROM watchlists
        WHERE watchlist_name = 'Growth Stocks'
          AND user_id = (
              SELECT user_id
              FROM users
              WHERE email = 'bob@example.com'
          )
    ),
    (SELECT stock_id FROM stocks WHERE symbol = 'NVDA')
);


-- ============================================================
-- 9. BUY ORDERS
-- ============================================================

INSERT INTO orders
    (
        account_id,
        stock_id,
        order_type,
        quantity,
        order_price,
        order_status
    )
VALUES
(
    (
        SELECT account_id
        FROM accounts
        WHERE account_number = 'ACC10001'
    ),
    (SELECT stock_id FROM stocks WHERE symbol = 'AAPL'),
    'BUY',
    10,
    230.00,
    'EXECUTED'
),
(
    (
        SELECT account_id
        FROM accounts
        WHERE account_number = 'ACC10001'
    ),
    (SELECT stock_id FROM stocks WHERE symbol = 'NVDA'),
    'BUY',
    20,
    180.00,
    'EXECUTED'
),
(
    (
        SELECT account_id
        FROM accounts
        WHERE account_number = 'ACC10002'
    ),
    (SELECT stock_id FROM stocks WHERE symbol = 'MSFT'),
    'BUY',
    5,
    510.00,
    'EXECUTED'
);


-- ============================================================
-- 10. TRADES
-- ============================================================

INSERT INTO trades
    (order_id, quantity, execution_price)
VALUES
(
    (
        SELECT order_id
        FROM orders
        WHERE account_id = (
            SELECT account_id
            FROM accounts
            WHERE account_number = 'ACC10001'
        )
        AND stock_id = (
            SELECT stock_id
            FROM stocks
            WHERE symbol = 'AAPL'
        )
        AND order_type = 'BUY'
        AND quantity = 10
    ),
    10,
    230.00
),
(
    (
        SELECT order_id
        FROM orders
        WHERE account_id = (
            SELECT account_id
            FROM accounts
            WHERE account_number = 'ACC10001'
        )
        AND stock_id = (
            SELECT stock_id
            FROM stocks
            WHERE symbol = 'NVDA'
        )
        AND order_type = 'BUY'
        AND quantity = 20
    ),
    20,
    180.00
),
(
    (
        SELECT order_id
        FROM orders
        WHERE account_id = (
            SELECT account_id
            FROM accounts
            WHERE account_number = 'ACC10002'
        )
        AND stock_id = (
            SELECT stock_id
            FROM stocks
            WHERE symbol = 'MSFT'
        )
        AND order_type = 'BUY'
        AND quantity = 5
    ),
    5,
    510.00
);


-- ============================================================
-- 11. HOLDINGS
-- ============================================================

INSERT INTO holdings
    (
        account_id,
        stock_id,
        quantity,
        average_buy_price
    )
VALUES
(
    (
        SELECT account_id
        FROM accounts
        WHERE account_number = 'ACC10001'
    ),
    (SELECT stock_id FROM stocks WHERE symbol = 'AAPL'),
    10,
    230.00
),
(
    (
        SELECT account_id
        FROM accounts
        WHERE account_number = 'ACC10001'
    ),
    (SELECT stock_id FROM stocks WHERE symbol = 'NVDA'),
    20,
    180.00
),
(
    (
        SELECT account_id
        FROM accounts
        WHERE account_number = 'ACC10002'
    ),
    (SELECT stock_id FROM stocks WHERE symbol = 'MSFT'),
    5,
    510.00
);


-- ============================================================
-- 12. TRANSACTIONS
-- ============================================================

INSERT INTO transactions
    (
        account_id,
        order_id,
        transaction_type,
        amount
    )
VALUES
(
    (
        SELECT account_id
        FROM accounts
        WHERE account_number = 'ACC10001'
    ),
    NULL,
    'DEPOSIT',
    100000.00
),
(
    (
        SELECT account_id
        FROM accounts
        WHERE account_number = 'ACC10001'
    ),
    (
        SELECT order_id
        FROM orders
        WHERE account_id = (
            SELECT account_id
            FROM accounts
            WHERE account_number = 'ACC10001'
        )
        AND stock_id = (
            SELECT stock_id
            FROM stocks
            WHERE symbol = 'AAPL'
        )
        AND order_type = 'BUY'
        AND quantity = 10
    ),
    'BUY',
    2300.00
),
(
    (
        SELECT account_id
        FROM accounts
        WHERE account_number = 'ACC10001'
    ),
    (
        SELECT order_id
        FROM orders
        WHERE account_id = (
            SELECT account_id
            FROM accounts
            WHERE account_number = 'ACC10001'
        )
        AND stock_id = (
            SELECT stock_id
            FROM stocks
            WHERE symbol = 'NVDA'
        )
        AND order_type = 'BUY'
        AND quantity = 20
    ),
    'BUY',
    3600.00
),
(
    (
        SELECT account_id
        FROM accounts
        WHERE account_number = 'ACC10002'
    ),
    NULL,
    'DEPOSIT',
    50000.00
),
(
    (
        SELECT account_id
        FROM accounts
        WHERE account_number = 'ACC10002'
    ),
    (
        SELECT order_id
        FROM orders
        WHERE account_id = (
            SELECT account_id
            FROM accounts
            WHERE account_number = 'ACC10002'
        )
        AND stock_id = (
            SELECT stock_id
            FROM stocks
            WHERE symbol = 'MSFT'
        )
        AND order_type = 'BUY'
        AND quantity = 5
    ),
    'BUY',
    2550.00
);