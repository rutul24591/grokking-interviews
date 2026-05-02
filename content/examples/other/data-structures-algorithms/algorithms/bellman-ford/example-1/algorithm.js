function bellmanFord(nodes, edges, start) {
  const dist = new Map(nodes.map((n) => [n, Infinity]));
  dist.set(start, 0);

  for (let i = 0; i < nodes.length - 1; i += 1) {
    let changed = false;
    for (const { from, to, weight } of edges) {
      const fromDist = dist.get(from);
      if (fromDist !== Infinity && fromDist + weight < dist.get(to)) {
        dist.set(to, fromDist + weight);
        changed = true;
      }
    }
    if (!changed) break;
  }

  for (const { from, to, weight } of edges) {
    const fromDist = dist.get(from);
    if (fromDist !== Infinity && fromDist + weight < dist.get(to)) {
      return { distances: Object.fromEntries(dist), hasNegativeCycle: true };
    }
  }

  return { distances: Object.fromEntries(dist), hasNegativeCycle: false };
}

module.exports = { bellmanFord };
