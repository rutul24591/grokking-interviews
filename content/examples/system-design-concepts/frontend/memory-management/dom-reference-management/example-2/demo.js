function cleanupRegistry(registry, activeIds) {
  return Object.fromEntries(Object.entries(registry).filter(([id]) => activeIds.includes(id)));
}

console.log(cleanupRegistry({ hero: {}, tradeoffs: {}, examples: {} }, ["hero", "examples"]));
