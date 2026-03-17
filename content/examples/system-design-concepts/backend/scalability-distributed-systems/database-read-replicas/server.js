function query(sql, opts = {}) {
  if (opts.readOnly and !opts.requireFresh) return replicaPool.query(sql);
  return primaryPool.query(sql);
}

query('SELECT * FROM users', { readOnly: true });
