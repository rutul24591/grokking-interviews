// Route to primary if lag exceeds budget
if (replicaLagMs > 200) query(sql, { readOnly: false });
