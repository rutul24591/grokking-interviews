function analyzeQuery(input, synonyms) {
  const baseTokens = input.toLowerCase().split(/\s+/).filter(Boolean);
  const expanded = new Set(baseTokens);
  for (const token of baseTokens) {
    for (const synonym of synonyms[token] ?? []) expanded.add(synonym);
  }
  return Array.from(expanded);
}

console.log(analyzeQuery("search infra", { infra: ["infrastructure"], search: ["retrieval"] }));
