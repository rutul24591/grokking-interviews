const timeline = [
  { t: 0, event: 'fetch', result: 'network' },
  { t: 5, event: 'read', result: 'cache-hit' },
  { t: 16, event: 'read', result: 'stale-refetch' },
  { t: 20, event: 'mutation', result: 'invalidate' },
  { t: 21, event: 'read', result: 'network-after-invalidate' }
];
console.table(timeline);
