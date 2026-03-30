const routes = [
  { path: '/api/time', strategy: 'network-first' },
  { path: '/assets/app.js', strategy: 'stale-while-revalidate' },
  { path: '/images/logo.png', strategy: 'cache-first' }
];
console.table(routes);
