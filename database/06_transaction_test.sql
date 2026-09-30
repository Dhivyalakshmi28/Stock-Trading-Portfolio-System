-- ============================================================
-- ACID TRANSACTION TEST
-- Alice buys 5 additional AAPL shares
-- ============================================================

BEGIN;


-- ============================================================
-- 1. Get and lock Alice's account
-- ============================================================

SELECT account_id
FROM accounts
WHERE account_number = 'ACC10001'
FOR UPDATE;


-- ============================================================
-- 2. Create BUY order
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

    (
        SELECT stock_id
        FROM stocks
        WHERE symbol = 'AAPL'
    ),

    'BUY',
    5,
    231.20,
    'EXECUTED'
)
RETURNING order_id;


-- ============================================================
-- 3. Create trade
-- ============================================================

INSERT INTO trades
(
    order_id,
    quantity,
    execution_price
)
VALUES
(
    (
        SELECT MAX(order_id)
        FROM orders
        WHERE account_id = (
            SELECT account_id
            FROM accounts
            WHERE account_number = 'ACC10001'
        )
    ),
    5,
    231.20
);


-- ============================================================
-- 4. Deduct money from account
-- ============================================================

UPDATE accounts
SET cash_balance = cash_balance - (5 * 231.20)
WHERE account_number = 'ACC10001'
  AND cash_balance >= (5 * 231.20);


-- ============================================================
-- 5. Update AAPL holding
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

    (
        SELECT stock_id
        FROM stocks
        WHERE symbol = 'AAPL'
    ),

    5,
    231.20
)

ON CONFLICT (account_id, stock_id)

DO UPDATE SET

    average_buy_price =
    (
        holdings.quantity * holdings.average_buy_price
        +
        EXCLUDED.quantity * EXCLUDED.average_buy_price
    )
    /
    (
        holdings.quantity + EXCLUDED.quantity
    ),

    quantity =
        holdings.quantity + EXCLUDED.quantity,

    updated_at = CURRENT_TIMESTAMP;


-- ============================================================
-- 6. Create financial transaction record
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

    (
        SELECT MAX(order_id)
        FROM orders
        WHERE account_id = (
            SELECT account_id
            FROM accounts
            WHERE account_number = 'ACC10001'
        )
    ),

    'BUY',
    5 * 231.20
);


-- ============================================================
-- 7. COMMIT
-- ============================================================

COMMIT;