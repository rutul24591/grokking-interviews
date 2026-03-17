-- Trigger function and trigger.

CREATE OR REPLACE FUNCTION audit_payment_insert()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO payments_audit (payment_id, action)
  VALUES (NEW.id, 'insert');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_payment_insert
AFTER INSERT ON payments
FOR EACH ROW EXECUTE FUNCTION audit_payment_insert();
