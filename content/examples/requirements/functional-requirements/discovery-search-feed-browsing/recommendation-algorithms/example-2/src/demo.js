function diversifyByCluster(candidates, limit) {
  const seen = new Set();
  const picked = [];
  for (const candidate of [...candidates].sort((a, b) => b.score - a.score)) {
    if (seen.has(candidate.cluster)) continue;
    seen.add(candidate.cluster);
    picked.push(candidate.id);
    if (picked.length === limit) break;
  }
  return picked;
}
console.log(diversifyByCluster([
  { id: 'a', cluster: 'search', score: 0.95 },
  { id: 'b', cluster: 'search', score: 0.91 },
  { id: 'c', cluster: 'feeds', score: 0.89 },
  { id: 'd', cluster: 'recs', score: 0.82 }
], 3));
