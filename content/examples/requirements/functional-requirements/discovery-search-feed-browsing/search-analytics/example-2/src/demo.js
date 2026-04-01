function flagZeroResultQueries(queries, minSearches, threshold) {
  return queries.filter((query) => query.searches >= minSearches && query.zeroResultRate >= threshold).map((query) => query.term);
}
console.log(flagZeroResultQueries([
  { term: 'system design', searches: 100, zeroResultRate: 0.01 },
  { term: 'vector database', searches: 80, zeroResultRate: 0.22 }
], 50, 0.15));
