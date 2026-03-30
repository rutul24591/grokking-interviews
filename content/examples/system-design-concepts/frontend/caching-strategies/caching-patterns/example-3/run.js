const requests = [
  { kind: 'GET /feed', recommended: 'network-first' },
  { kind: 'POST /login', recommended: 'network-only' },
  { kind: 'GET /me', recommended: 'private network-first' }
];
console.table(requests);
