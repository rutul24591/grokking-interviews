-- Sample data for the commerce schema.

INSERT INTO customers (name, email) VALUES
  ('Ada Lovelace', 'ada@example.com'),
  ('Grace Hopper', 'grace@example.com');

INSERT INTO products (sku, name, price_cents) VALUES
  ('sku-100', 'Router', 12900),
  ('sku-200', 'Switch', 9800),
  ('sku-300', 'Load Balancer', 21500);

INSERT INTO orders (customer_id, status) VALUES
  (1, 'paid'),
  (2, 'processing');

INSERT INTO order_items (order_id, product_id, quantity, price_cents) VALUES
  (1, 1, 1, 12900),
  (1, 2, 2, 9800),
  (2, 3, 1, 21500);
