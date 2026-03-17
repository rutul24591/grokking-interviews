-- Postgres range partitioning by date
CREATE TABLE events (
  id BIGSERIAL PRIMARY KEY,
  event_time TIMESTAMP NOT NULL,
  payload JSONB NOT NULL
) PARTITION BY RANGE (event_time);

CREATE TABLE events_2026_01 PARTITION OF events
FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
