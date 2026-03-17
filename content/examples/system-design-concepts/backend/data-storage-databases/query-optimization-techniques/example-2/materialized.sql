CREATE MATERIALIZED VIEW order_totals AS SELECT user_id, SUM(total_cents) total FROM orders GROUP BY user_id;
