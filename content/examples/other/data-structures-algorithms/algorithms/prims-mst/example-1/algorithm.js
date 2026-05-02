function primMst(graph, start) {
  const visited = new Set([start]);
  const edges = [];
  const nodes = Object.keys(graph);

  while (visited.size < nodes.length) {
    let best = null;
    for (const node of visited) {
      for (const edge of graph[node] ?? []) {
        if (!visited.has(edge.to) && (!best || edge.weight < best.weight)) {
          best = { from: node, ...edge };
        }
      }
    }
    if (!best) break;
    visited.add(best.to);
    edges.push(best);
  }
  return edges;
}

module.exports = { primMst };
