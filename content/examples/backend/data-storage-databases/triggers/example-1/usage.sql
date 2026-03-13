-- Insert a payment and check audit log.

INSERT INTO payments (amount_cents) VALUES (1200);
SELECT * FROM payments_audit;
