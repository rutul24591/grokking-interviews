const scenarios = [
  { hasData: false, hasFilters: false, type: 'first-use' },
  { hasData: true, hasFilters: true, type: 'filtered-empty' },
  { hasError: true, type: 'error-not-empty' }
];
console.table(scenarios);
