-- Denormalized reporting table for analytics.

CREATE TABLE order_report (
  order_id INTEGER PRIMARY KEY,
  customer_name TEXT NOT NULL,
  total_cents INTEGER NOT NULL,
  status TEXT NOT NULL
);

-- Example refresh strategy (batch rebuild).
INSERT INTO order_report (order_id, customer_name, total_cents, status)
SELECT
  o.id,
  c.name,
  SUM(oi.quantity * oi.price_cents) AS total_cents,
  o.status
FROM orders o
JOIN customers c ON c.id = o.customer_id
JOIN order_items oi ON oi.order_id = o.id
GROUP BY o.id, c.name, o.status;
