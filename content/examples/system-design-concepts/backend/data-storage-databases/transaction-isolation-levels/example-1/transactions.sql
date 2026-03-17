-- Isolation level walkthrough (run in two sessions).

-- Session A:
-- BEGIN;
-- SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
-- SELECT stock FROM inventory WHERE sku = 'sku-1';
-- (wait)
-- SELECT stock FROM inventory WHERE sku = 'sku-1';
-- COMMIT;

-- Session B:
-- BEGIN;
-- UPDATE inventory SET stock = stock - 2 WHERE sku = 'sku-1';
-- COMMIT;

-- Repeat with REPEATABLE READ and SERIALIZABLE to observe differences.
