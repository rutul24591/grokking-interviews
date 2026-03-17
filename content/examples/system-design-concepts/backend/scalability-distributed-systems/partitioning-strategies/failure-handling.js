-- If partition missing, fall back and schedule backfill
SELECT * FROM events_2026_01 WHERE event_time >= '2026-01-10';
