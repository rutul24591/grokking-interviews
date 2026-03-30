const strategies = [
  { name: 'cache-first', latencyMs: 20, freshness: 'stale risk' },
  { name: 'network-first', latencyMs: 220, freshness: 'fresh if network works' },
  { name: 'stale-while-revalidate', latencyMs: 25, freshness: 'stale then refresh' }
];
console.table(strategies);
