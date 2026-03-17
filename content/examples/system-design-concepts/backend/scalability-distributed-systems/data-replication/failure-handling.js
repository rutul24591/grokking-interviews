// Route to primary if replica stale
if (replicaLagMs > 200) await primary.get('user:1');
