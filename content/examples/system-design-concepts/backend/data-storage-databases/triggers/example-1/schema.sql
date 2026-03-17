-- Tables for trigger demo.

CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  amount_cents INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE payments_audit (
  id SERIAL PRIMARY KEY,
  payment_id INTEGER NOT NULL,
  action TEXT NOT NULL,
  action_at TIMESTAMP NOT NULL DEFAULT NOW()
);
