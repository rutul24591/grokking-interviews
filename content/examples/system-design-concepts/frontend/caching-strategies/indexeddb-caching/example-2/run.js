const records = [
  { id: 'a1', expiresAt: Date.now() + 1_000 },
  { id: 'a2', expiresAt: Date.now() - 1_000 }
];
console.log(records.map((record) => ({ ...record, valid: record.expiresAt > Date.now() })));
