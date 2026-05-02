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
  let current = target;
  while (current !== undefined) {
    path.push(current);
    if (current === start) break;
    current = parent.get(current);
  }
  return path.reverse();
}

const graph = { A: ["B", "C"], B: ["D"], C: ["D"], D: [] };
console.log("A -> D:", shortestPath(graph, "A", "D"));
console.log("A -> Z:", shortestPath(graph, "A", "Z"));
