function evaluateFeedPlacement(items) {
  return [...items]
    .sort((left, right) => right.affinity - left.affinity || left.recencyMinutes - right.recencyMinutes)
    .map((item, index) => ({
      id: item.id,
      lane: item.affinity >= 80 ? "hero" : item.affinity >= 60 ? "primary" : "secondary",
      injectDiversityCard: index > 1 && item.authorRepeated,
      holdForBackfill: item.staleMinutes > item.maxStaleness
    }));
}

console.log(evaluateFeedPlacement([
  { id: "af-1", affinity: 84, recencyMinutes: 5, authorRepeated: false, staleMinutes: 2, maxStaleness: 10 },
  { id: "af-2", affinity: 61, recencyMinutes: 20, authorRepeated: true, staleMinutes: 6, maxStaleness: 10 },
  { id: "af-3", affinity: 58, recencyMinutes: 12, authorRepeated: true, staleMinutes: 14, maxStaleness: 8 }
]));
