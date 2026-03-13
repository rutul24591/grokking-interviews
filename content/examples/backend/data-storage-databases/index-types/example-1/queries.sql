-- Queries using different index types.

SELECT * FROM orders WHERE customer_id = 10 AND status = 'open';
SELECT * FROM orders WHERE status = 'open' ORDER BY created_at DESC LIMIT 50;
SELECT * FROM orders WHERE lower(status) = 'shipped';
