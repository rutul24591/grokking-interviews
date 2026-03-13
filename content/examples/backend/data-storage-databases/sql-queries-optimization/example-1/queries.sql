-- Slow query: full scan with leading wildcard.
SELECT * FROM events WHERE event_type LIKE '%view%';

-- Optimized query: selective predicates with index support.
SELECT * FROM events WHERE user_id = 1 ORDER BY created_at DESC LIMIT 10;

-- Another optimized query: time range filtering.
SELECT * FROM events
WHERE user_id = 1
  AND created_at >= NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;
