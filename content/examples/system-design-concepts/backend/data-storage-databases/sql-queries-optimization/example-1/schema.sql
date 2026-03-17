-- Tables for query optimization examples.

CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  event_type TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_events_user_created ON events (user_id, created_at DESC);
