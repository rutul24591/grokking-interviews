const { Queue } = require("./pattern");
const graph = { A: ["B","C"], B: ["D"], C: ["D"], D: [] };
const q = new Queue();
const visited = new Set(["A"]);
q.enqueue("A");
const order = [];
while (q.size()) {
  const node = q.dequeue();
  order.push(node);
  for (const n of graph[node]) if (!visited.has(n)) { visited.add(n); q.enqueue(n); }
}
console.log(order);
