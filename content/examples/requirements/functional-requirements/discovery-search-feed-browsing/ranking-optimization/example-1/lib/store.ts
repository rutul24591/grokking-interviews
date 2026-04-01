export const rankingState = {
  weights: { relevance: 0.5, freshness: 0.2, engagement: 0.3 },
  candidates: [
    { id: 'r1', title: 'Distributed systems primer', relevance: 0.95, freshness: 0.4, engagement: 0.6 },
    { id: 'r2', title: 'Feed ranking failures', relevance: 0.8, freshness: 0.7, engagement: 0.75 },
    { id: 'r3', title: 'Search UI patterns', relevance: 0.7, freshness: 0.95, engagement: 0.5 }
  ],
  rankedIds: ['r1', 'r2', 'r3'],
  lastMessage: 'Initial ranking computed.'
};
