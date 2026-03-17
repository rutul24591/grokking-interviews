-- Sample event data.

INSERT INTO events (user_id, event_type, created_at) VALUES
  (1, 'login', NOW() - INTERVAL '1 day'),
  (1, 'view', NOW() - INTERVAL '12 hours'),
  (1, 'purchase', NOW() - INTERVAL '2 hours'),
  (2, 'login', NOW() - INTERVAL '3 days'),
  (2, 'view', NOW() - INTERVAL '2 days');
