-- EXPLAIN plans to compare execution strategies.

EXPLAIN SELECT * FROM events WHERE event_type LIKE '%view%';
EXPLAIN SELECT * FROM events WHERE user_id = 1 ORDER BY created_at DESC LIMIT 10;
EXPLAIN SELECT * FROM events
WHERE user_id = 1
  AND created_at >= NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;
