function fallbackModule(cards, minimumConfidence) {
  const eligible = cards.filter((card) => card.confidence >= minimumConfidence);
  if (eligible.length === 0) return ["fallback-trending-card"];
  return eligible.map((card) => card.id);
}

console.log(fallbackModule([{ id: "a", confidence: 0.41 }, { id: "b", confidence: 0.38 }], 0.5));
console.log(fallbackModule([{ id: "c", confidence: 0.81 }, { id: "d", confidence: 0.64 }], 0.5));
