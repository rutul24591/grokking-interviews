function applyColdStartFallback(candidates) {
  return candidates.map((candidate) => ({
    id: candidate.id,
    score: candidate.collaborativeScore == null
      ? candidate.topicMatch * 0.75 + candidate.recency * 0.25
      : candidate.topicMatch * 0.4 + candidate.collaborativeScore * 0.45 + candidate.recency * 0.15
  })).sort((a, b) => b.score - a.score).map((candidate) => candidate.id);
}
console.log(applyColdStartFallback([
  { id: 'a', topicMatch: 0.9, collaborativeScore: null, recency: 0.6 },
  { id: 'b', topicMatch: 0.7, collaborativeScore: 0.9, recency: 0.4 }
]));
