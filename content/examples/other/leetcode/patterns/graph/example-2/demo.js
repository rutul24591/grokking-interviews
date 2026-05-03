const assert = require("node:assert/strict");

function bfsMinHops(graph, start, target) {
  const queue = [start];
  const visited = new Set([start]);
  const parent = new Map();

  while (queue.length) {
    const node = queue.shift();
    if (node === target) break;
    for (const { to } of graph.get(node) ?? []) {
      if (!visited.has(to)) {
        visited.add(to);
        parent.set(to, node);
        queue.push(to);
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

function dijkstra(graph, start) {
  const dist = new Map([[start, 0]]);
  const prev = new Map();
  const pq = [{ node: start, d: 0 }];

  while (pq.length) {
    pq.sort((a, b) => a.d - b.d);
    const { node, d } = pq.shift();
    if (d !== dist.get(node)) continue;
    for (const { to, w } of graph.get(node) ?? []) {
      if (w < 0) throw new Error("Dijkstra requires non-negative edge weights");
      const nd = d + w;
      const best = dist.get(to);
      if (best === undefined || nd < best) {
        dist.set(to, nd);
        prev.set(to, node);
        pq.push({ node: to, d: nd });
      }
    }
  }

  return { dist, prev };
}

function bellmanFord(edges, nodes, start) {
  const dist = new Map();
  const prev = new Map();
  for (const n of nodes) dist.set(n, Infinity);
  dist.set(start, 0);

  for (let i = 0; i < nodes.length - 1; i += 1) {
    let changed = false;
    for (const { from, to, w } of edges) {
      const d = dist.get(from);
      if (!Number.isFinite(d)) continue;
      if (d + w < dist.get(to)) {
        dist.set(to, d + w);
        prev.set(to, from);
        changed = true;
      }
    }
    if (!changed) break;
  }

  for (const { from, to, w } of edges) {
    const d = dist.get(from);
    if (Number.isFinite(d) && d + w < dist.get(to)) {
      return { dist, prev, hasNegativeCycle: true };
    }
  }
  return { dist, prev, hasNegativeCycle: false };
}

function pathFromPrev(prev, start, target) {
  const path = [];
  let curr = target;
  while (curr !== undefined) {
    path.push(curr);
    if (curr === start) break;
    curr = prev.get(curr);
  }
  if (path[path.length - 1] !== start) return null;
  return path.reverse();
}

// Weighted graph where the fewest-hops path is NOT the cheapest path:
// A -> B (10), A -> C (1), C -> D (1), D -> B (1)
const g = new Map([
  ["A", [{ to: "B", w: 10 }, { to: "C", w: 1 }]],
  ["C", [{ to: "D", w: 1 }]],
  ["D", [{ to: "B", w: 1 }]],
  ["B", []],
]);

const hopsPath = bfsMinHops(g, "A", "B");
console.log("BFS (min hops) path:", hopsPath);
assert.deepEqual(hopsPath, ["A", "B"]);

const { dist, prev } = dijkstra(g, "A");
const cheapestPath = pathFromPrev(prev, "A", "B");
console.log("Dijkstra cheapest path:", cheapestPath, "cost:", dist.get("B"));
assert.deepEqual(cheapestPath, ["A", "C", "D", "B"]);
assert.equal(dist.get("B"), 3);

// Negative weight follow-up: Bellman–Ford detection
const nodes = ["S", "A", "B"];
const edges = [
  { from: "S", to: "A", w: 1 },
  { from: "A", to: "B", w: -2 },
  { from: "B", to: "A", w: -2 }, // negative cycle between A <-> B
];
const bf = bellmanFord(edges, nodes, "S");
console.log("Bellman–Ford hasNegativeCycle:", bf.hasNegativeCycle);
assert.equal(bf.hasNegativeCycle, true);

console.log("OK: weighted-graph follow-up checks passed.");
