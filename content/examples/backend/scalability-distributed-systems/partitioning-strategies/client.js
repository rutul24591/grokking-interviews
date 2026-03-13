// Query includes partition key for pruning
SELECT * FROM events WHERE event_time >= '2026-01-10' AND event_time < '2026-01-11';
