const responses = [
  { route: '/api/me', vary: 'Authorization', cacheableAtEdge: false },
  { route: '/articles/system-design', vary: null, cacheableAtEdge: true }
];
console.table(responses);
