-- Add column with default and backfill.
ALTER TABLE customers ADD COLUMN tier TEXT DEFAULT 'free';
UPDATE customers SET tier = 'pro' WHERE email LIKE '%@example.com';
