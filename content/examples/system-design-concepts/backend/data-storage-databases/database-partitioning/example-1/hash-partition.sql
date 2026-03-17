-- Hash partitioning by tenant_id.

CREATE TABLE tenant_events (
  id SERIAL,
  tenant_id INTEGER NOT NULL,
  payload TEXT NOT NULL
) PARTITION BY HASH (tenant_id);

CREATE TABLE tenant_events_p0 PARTITION OF tenant_events
  FOR VALUES WITH (MODULUS 4, REMAINDER 0);
CREATE TABLE tenant_events_p1 PARTITION OF tenant_events
  FOR VALUES WITH (MODULUS 4, REMAINDER 1);
CREATE TABLE tenant_events_p2 PARTITION OF tenant_events
  FOR VALUES WITH (MODULUS 4, REMAINDER 2);
CREATE TABLE tenant_events_p3 PARTITION OF tenant_events
  FOR VALUES WITH (MODULUS 4, REMAINDER 3);
