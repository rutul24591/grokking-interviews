function preloadCandidate(transitions) {
  const sorted = [...transitions].sort((a, b) => b.probability - a.probability);
  const winner = sorted[0];
  return {
    candidate: winner.path,
    preload: winner.probability >= 0.6 && winner.weightKb <= 80,
    reason: winner.probability >= 0.6 && winner.weightKb <= 80 ? "high-probability-and-manageable-weight" : "too-heavy-or-uncertain"
  };
}

console.log(preloadCandidate([{ path: "/analytics", probability: 0.7, weightKb: 74 }, { path: "/billing", probability: 0.3, weightKb: 58 }]));
