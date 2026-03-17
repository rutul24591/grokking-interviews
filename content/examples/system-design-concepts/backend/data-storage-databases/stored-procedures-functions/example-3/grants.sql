REVOKE ALL ON orders FROM public;
GRANT EXECUTE ON FUNCTION order_total(order_id INT) TO app_role;
