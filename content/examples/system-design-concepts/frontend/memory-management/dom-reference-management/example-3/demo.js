function resolveTarget(items, refsById, targetId) {
  const exists = items.some((item) => item.id === targetId);
  return { exists, refFound: Boolean(refsById[targetId]) };
}

const items = [{ id: "tradeoffs" }, { id: "hero" }, { id: "examples" }];
console.log(resolveTarget(items, { hero: {}, tradeoffs: {}, examples: {} }, "hero"));
