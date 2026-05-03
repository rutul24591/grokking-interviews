function shortestPath(graph, start, target) {
  const queue = [start];
  const visited = new Set([start]);
  const parent = new Map();

  while (queue.length) {
    const node = queue.shift();
    if (node === target) break;
    for (const neighbor of graph[node] ?? []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        parent.set(neighbor, node);
        queue.push(neighbor);
      }
    }
  }

  if (!visited.has(target)) return null;
  const path = [];
  let curr = target;
  while (curr !== undefined) {
    path.push(curr);
    if (curr === start) break;
    curr = parent.get(curr);
  }
  return path.reverse();
}

module.exports = { shortestPath };
