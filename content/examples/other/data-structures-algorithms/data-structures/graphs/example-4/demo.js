function dijkstra(graph, start) {
  const distances = new Map(Object.keys(graph).map((node) => [node, Infinity]));
  distances.set(start, 0);
  const visited = new Set();

  while (visited.size < distances.size) {
    let current = null;
    let best = Infinity;
    for (const [node, distance] of distances) {
      if (!visited.has(node) && distance < best) {
        best = distance;
        current = node;
      }
    }
    if (current === null) break;

    visited.add(current);
    for (const { to, weight } of graph[current] ?? []) {
      const next = distances.get(current) + weight;
      if (next < distances.get(to)) distances.set(to, next);
    }
  }

  return Object.fromEntries(distances);
}

const graph = {
  A: [
    { to: "B", weight: 2 },
    { to: "C", weight: 5 },
  ],
  B: [
    { to: "C", weight: 1 },
    { to: "D", weight: 4 },
  ],
  C: [{ to: "D", weight: 1 }],
  D: [],
};

console.log("Distances from A:", dijkstra(graph, "A"));
