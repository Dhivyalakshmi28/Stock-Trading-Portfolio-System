ALTER TABLE stocks
ADD COLUMN instrument_type VARCHAR(20)
DEFAULT 'STOCK';

ALTER TABLE stocks
ADD CONSTRAINT chk_instrument_type
CHECK (instrument_type IN ('STOCK', 'ETF'));