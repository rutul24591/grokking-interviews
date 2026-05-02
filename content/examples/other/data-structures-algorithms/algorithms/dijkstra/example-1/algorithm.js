function dijkstra(graph, start) {
  const nodes = Object.keys(graph);
  const dist = new Map(nodes.map((n) => [n, Infinity]));
  dist.set(start, 0);
  const visited = new Set();

  while (visited.size < nodes.length) {
    let current = null;
    let best = Infinity;
    for (const node of nodes) {
      const d = dist.get(node);
      if (!visited.has(node) && d < best) {
        best = d;
        current = node;
      }
    }
    if (current === null) break;
    visited.add(current);
    for (const edge of graph[current] ?? []) {
      if (edge.weight < 0) throw new Error("Negative weight not allowed for Dijkstra");
      const next = dist.get(current) + edge.weight;
      if (next < dist.get(edge.to)) dist.set(edge.to, next);
    }
  }
  return Object.fromEntries(dist);
}

module.exports = { dijkstra };
