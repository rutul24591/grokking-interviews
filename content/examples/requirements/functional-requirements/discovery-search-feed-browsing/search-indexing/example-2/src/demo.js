function normalizeTokens(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
}
console.log(normalizeTokens('Search Ranking, at Scale!'));
