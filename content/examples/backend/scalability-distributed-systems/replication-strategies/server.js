// Read/write split
function query(sql, opts = {}) {
  if (opts.readOnly) return readReplicaPool.query(sql);
  return primaryPool.query(sql);
}

query('SELECT * FROM users', { readOnly: true });
query('UPDATE users SET active = true WHERE id = 1');
