const edges = [
  ["schema", "api"],
  ["api", "web"],
  ["shared-ui", "web"],
];

const nodes = new Set(edges.flat());
const indegree = new Map([...nodes].map((node) => [node, 0]));
const adjacency = new Map([...nodes].map((node) => [node, []]));

for (const [from, to] of edges) {
  adjacency.get(from).push(to);
  indegree.set(to, indegree.get(to) + 1);
}

const queue = [...nodes].filter((node) => indegree.get(node) === 0);
const order = [];

while (queue.length) {
  const node = queue.shift();
  order.push(node);
  for (const neighbor of adjacency.get(node)) {
    indegree.set(neighbor, indegree.get(neighbor) - 1);
    if (indegree.get(neighbor) === 0) queue.push(neighbor);
  }
}

console.log("Topological order:", order);
