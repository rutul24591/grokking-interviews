// Prefer replica for reads
query('SELECT * FROM users', { readOnly: true });
