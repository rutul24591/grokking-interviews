-- Stored function to compute order totals.

CREATE OR REPLACE FUNCTION order_total(order_id INT)
RETURNS INT AS $$
  SELECT SUM(price_cents * quantity)
  FROM order_items
  WHERE order_items.order_id = $1;
$$ LANGUAGE SQL;
