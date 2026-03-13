-- Queries that benefit from indexes.

SELECT * FROM users WHERE email = 'ada@example.com';

-- Query that cannot use the email index efficiently.
SELECT * FROM users WHERE email LIKE '%@example.com';
