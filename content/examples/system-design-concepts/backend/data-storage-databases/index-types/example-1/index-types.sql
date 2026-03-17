-- Index definitions for common patterns.

-- Unique index for idempotency keys.
CREATE UNIQUE INDEX idx_orders_idempotency ON orders ((customer_id || '-' || created_at::date));

-- Composite index for filtering by customer and status.
CREATE INDEX idx_orders_customer_status ON orders (customer_id, status);

-- Partial index for open orders only.
CREATE INDEX idx_orders_open ON orders (created_at)
WHERE status = 'open';

-- Expression index for lowercased status.
CREATE INDEX idx_orders_status_lower ON orders (lower(status));
