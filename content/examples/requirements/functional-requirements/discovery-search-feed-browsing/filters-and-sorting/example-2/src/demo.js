function filterSummary(filters) {
  return Object.entries(filters).filter(([, value]) => value !== 'all').map(([key, value]) => `${key}:${value}`);
}
console.log(filterSummary({ category: 'backend', level: 'all' }));
