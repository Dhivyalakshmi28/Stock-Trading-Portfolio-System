-- Add exchanges required by the 38-instrument dataset

INSERT INTO exchanges
    (exchange_name, country, currency, timezone, status)
VALUES
    ('NYSE ARCA', 'USA', 'USD', 'America/New_York', 'ACTIVE'),
    ('NYSE AMERICAN', 'USA', 'USD', 'America/New_York', 'ACTIVE'),
    ('LSE', 'UK', 'USD', 'Europe/London', 'ACTIVE')
ON CONFLICT DO NOTHING;