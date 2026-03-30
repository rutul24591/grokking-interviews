const cases = [
  { route: '/api/feed', acceptable: true },
  { route: '/api/me/billing-balance', acceptable: false }
];
console.table(cases);
