CREATE INDEX idx_users_email_name ON users (email, name);
EXPLAIN SELECT email, name FROM users WHERE email = 'ada@example.com';
