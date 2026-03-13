-- Base tables for view examples.

CREATE TABLE sales (
  id SERIAL PRIMARY KEY,
  region TEXT NOT NULL,
  amount_cents INTEGER NOT NULL
);

INSERT INTO sales (region, amount_cents) VALUES
  ('us-east', 1200),
  ('us-east', 3000),
  ('eu', 1800);
