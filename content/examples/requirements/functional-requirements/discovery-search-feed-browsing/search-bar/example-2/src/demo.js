function mergeSuggestions(query, recentQueries, popularQueries) {
  const normalized = query.trim().toLowerCase();
  const recentMatches = recentQueries
    .filter((item) => item.includes(normalized))
    .map((item) => ({ label: item, source: "history", score: 3 }));
  const popularMatches = popularQueries
    .filter((item) => item.startsWith(normalized))
    .map((item, index) => ({ label: item, source: "popular", score: 5 - index }));

  return [...recentMatches, ...popularMatches]
    .sort((left, right) => right.score - left.score)
    .slice(0, 5);
}

console.log(
  mergeSuggestions(
    "search",
    ["search ranking", "feed ranking", "search analytics"],
    ["search indexing", "search quality", "search ui"]
  )
);
