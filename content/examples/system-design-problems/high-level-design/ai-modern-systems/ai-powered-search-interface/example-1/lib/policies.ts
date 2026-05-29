function reciprocalRankFusion(resultLists, rankConstant = 60) {
  const byId = new Map();

  for (const results of resultLists) {
    for (const result of results) {
      const existing = byId.get(result.id) ?? {
        id: result.id,
        fusedScore: 0,
        sources: [],
      };
      existing.fusedScore += 1 / (result.rank + rankConstant);
      existing.sources.push(result.source);
      byId.set(result.id, existing);
    }
  }

  return [...byId.values()].sort((a, b) => b.fusedScore - a.fusedScore);
}

function shouldGenerateAnswerBox({ intent, topScore, hasCitations }) {
  if (intent !== 'informational') return false;
  if (!hasCitations) return false;
  return topScore >= 0.75;
}

module.exports = { reciprocalRankFusion, shouldGenerateAnswerBox };
