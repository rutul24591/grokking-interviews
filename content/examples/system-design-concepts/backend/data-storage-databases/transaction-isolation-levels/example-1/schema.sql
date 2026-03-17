-- Table for isolation level demo.

CREATE TABLE inventory (
  id SERIAL PRIMARY KEY,
  sku TEXT NOT NULL UNIQUE,
  stock INTEGER NOT NULL
);

INSERT INTO inventory (sku, stock) VALUES
  ('sku-1', 10),
  ('sku-2', 5);
