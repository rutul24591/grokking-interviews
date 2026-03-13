-- Range partitioning by month.

CREATE TABLE events (
  id SERIAL,
  occurred_at DATE NOT NULL,
  payload TEXT NOT NULL
) PARTITION BY RANGE (occurred_at);

CREATE TABLE events_2025_01 PARTITION OF events
  FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

CREATE TABLE events_2025_02 PARTITION OF events
  FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');
