function weightedScore(item, weights) {
  return item.relevance * weights.relevance + item.freshness * weights.freshness + item.engagement * weights.engagement;
}
console.log(weightedScore({ relevance: 0.9, freshness: 0.5, engagement: 0.6 }, { relevance: 0.5, freshness: 0.2, engagement: 0.3 }));
