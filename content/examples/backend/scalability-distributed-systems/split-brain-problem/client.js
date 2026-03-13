// Require fencing token for writes
await db.write('UPDATE accounts', { fencingToken: token });
