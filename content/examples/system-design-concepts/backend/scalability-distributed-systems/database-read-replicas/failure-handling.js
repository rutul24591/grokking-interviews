// Switch to primary if lag too high
if (replicaLagMs > 200) query(sql, { readOnly: false });
