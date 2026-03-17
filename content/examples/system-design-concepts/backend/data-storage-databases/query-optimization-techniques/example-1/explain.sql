-- EXPLAIN for join ordering and index usage.

EXPLAIN SELECT u.name, o.total_cents
FROM users u
JOIN orders o ON o.user_id = u.id
WHERE o.total_cents > 10000;

EXPLAIN SELECT u.name, o.total_cents
FROM (
  SELECT * FROM orders WHERE total_cents > 10000
) o
JOIN users u ON u.id = o.user_id;

EXPLAIN SELECT user_id, created_at, total_cents
FROM orders
WHERE user_id = 42
ORDER BY created_at DESC
LIMIT 20;
