-- Schema for stored procedure demo.

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  status TEXT NOT NULL
);

CREATE TABLE order_items (
  order_id INTEGER NOT NULL,
  price_cents INTEGER NOT NULL,
  quantity INTEGER NOT NULL
);
