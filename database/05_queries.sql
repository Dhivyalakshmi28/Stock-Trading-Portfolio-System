SELECT
    s.symbol,
    s.stock_name,
    c.company_name,
    c.industry,
    e.exchange_name,
    e.country
FROM stocks s
JOIN companies c
    ON s.company_id = c.company_id
JOIN exchanges e
    ON s.exchange_id = e.exchange_id
ORDER BY s.symbol;

SELECT
    s.symbol,
    sp.timestamp,
    sp.open_price,
    sp.high_price,
    sp.low_price,
    sp.close_price,
    sp.volume
FROM stock_prices sp
JOIN stocks s
    ON sp.stock_id = s.stock_id
ORDER BY s.symbol, sp.timestamp;

SELECT
    u.full_name,
    s.symbol,
    h.quantity,
    h.average_buy_price
FROM holdings h
JOIN accounts a
    ON h.account_id = a.account_id
JOIN users u
    ON a.user_id = u.user_id
JOIN stocks s
    ON h.stock_id = s.stock_id
WHERE u.email = 'alice@example.com';

SELECT
    u.full_name,
    s.symbol,
    h.quantity,
    h.average_buy_price,
    latest.close_price AS current_price,
    h.quantity * h.average_buy_price AS investment,
    h.quantity * latest.close_price AS current_value
FROM holdings h
JOIN accounts a
    ON h.account_id = a.account_id
JOIN users u
    ON a.user_id = u.user_id
JOIN stocks s
    ON h.stock_id = s.stock_id
JOIN LATERAL (
    SELECT sp.close_price
    FROM stock_prices sp
    WHERE sp.stock_id = h.stock_id
    ORDER BY sp.timestamp DESC
    LIMIT 1
) latest
    ON TRUE
WHERE u.email = 'alice@example.com';

SELECT
    u.full_name,
    s.symbol,
    h.quantity,

    h.quantity * h.average_buy_price AS investment,

    h.quantity * latest.close_price AS current_value,

    (h.quantity * latest.close_price)
    -
    (h.quantity * h.average_buy_price) AS profit_loss

FROM holdings h

JOIN accounts a
    ON h.account_id = a.account_id

JOIN users u
    ON a.user_id = u.user_id

JOIN stocks s
    ON h.stock_id = s.stock_id

JOIN LATERAL (
    SELECT sp.close_price
    FROM stock_prices sp
    WHERE sp.stock_id = h.stock_id
    ORDER BY sp.timestamp DESC
    LIMIT 1
) latest
    ON TRUE

WHERE u.email = 'alice@example.com';

SELECT
    u.full_name,

    SUM(h.quantity * h.average_buy_price)
        AS total_investment,

    SUM(h.quantity * latest.close_price)
        AS total_current_value,

    SUM(
        h.quantity * latest.close_price
        -
        h.quantity * h.average_buy_price
    ) AS total_profit_loss

FROM holdings h

JOIN accounts a
    ON h.account_id = a.account_id

JOIN users u
    ON a.user_id = u.user_id

JOIN LATERAL (
    SELECT sp.close_price
    FROM stock_prices sp
    WHERE sp.stock_id = h.stock_id
    ORDER BY sp.timestamp DESC
    LIMIT 1
) latest
    ON TRUE

WHERE u.email = 'alice@example.com'

GROUP BY u.full_name;

-- ============================================================
-- PORTFOLIO SUMMARY VIEW
-- ============================================================

CREATE OR REPLACE VIEW portfolio_summary AS

SELECT
    u.user_id,
    u.full_name,
    s.stock_id,
    s.symbol,

    h.quantity,

    h.average_buy_price,

    latest.close_price AS current_price,

    h.quantity * h.average_buy_price AS investment,

    h.quantity * latest.close_price AS current_value,

    (
        h.quantity * latest.close_price
        -
        h.quantity * h.average_buy_price
    ) AS profit_loss

FROM holdings h

JOIN accounts a
    ON h.account_id = a.account_id

JOIN users u
    ON a.user_id = u.user_id

JOIN stocks s
    ON h.stock_id = s.stock_id

JOIN LATERAL (
    SELECT sp.close_price
    FROM stock_prices sp
    WHERE sp.stock_id = h.stock_id
    ORDER BY sp.timestamp DESC
    LIMIT 1
) latest
    ON TRUE;