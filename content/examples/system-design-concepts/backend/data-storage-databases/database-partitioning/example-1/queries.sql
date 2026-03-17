-- Queries that benefit from partition pruning.

SELECT * FROM events WHERE occurred_at = '2025-01-15';
SELECT * FROM tenant_events WHERE tenant_id = 42;
