-- Constraints example.
ALTER TABLE orders ADD CONSTRAINT chk_status CHECK (status IN ('paid','processing'));
