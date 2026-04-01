function pickTopPerSource(candidates) {
  const best = new Map();
  for (const candidate of candidates) {
    const current = best.get(candidate.source);
    if (!current || candidate.score > current.score) best.set(candidate.source, candidate);
  }
  return Array.from(best.values()).map((candidate) => candidate.id);
}
console.log(pickTopPerSource([{ id: 'a', source: 'trending', score: 0.9 }, { id: 'b', source: 'trending', score: 0.7 }, { id: 'c', source: 'following', score: 0.8 }]));
