-- Schema for index type demonstration.

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL,
  status TEXT NOT NULL,
  total_cents INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
