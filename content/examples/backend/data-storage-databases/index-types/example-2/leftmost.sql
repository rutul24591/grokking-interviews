CREATE INDEX idx_orders_customer_status_created ON orders (customer_id, status, created_at);
EXPLAIN SELECT * FROM orders WHERE customer_id = 1 AND status = 'open';
