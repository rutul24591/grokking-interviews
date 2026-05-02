function dfs(graph, start) {
  const visited = new Set();
  const order = [];
  function walk(node) {
    if (visited.has(node)) return;
    visited.add(node);
    order.push(node);
    for (const neighbor of graph[node] ?? []) walk(neighbor);
  }
  walk(start);
  return order;
}

module.exports = { dfs };
