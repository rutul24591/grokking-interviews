-- EXPLAIN to highlight index vs sequential scan.

EXPLAIN SELECT * FROM users WHERE email = 'ada@example.com';
EXPLAIN SELECT * FROM users WHERE email LIKE '%@example.com';
