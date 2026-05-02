function topoSort(nodes, edges) {
  const indegree = new Map(nodes.map((n) => [n, 0]));
  const adj = new Map(nodes.map((n) => [n, []]));
  for (const [from, to] of edges) {
    adj.get(from).push(to);
    indegree.set(to, indegree.get(to) + 1);
  }
  const queue = nodes.filter((n) => indegree.get(n) === 0);
  const order = [];
  while (queue.length) {
    const node = queue.shift();
    order.push(node);
    for (const neighbor of adj.get(node)) {
      indegree.set(neighbor, indegree.get(neighbor) - 1);
      if (indegree.get(neighbor) === 0) queue.push(neighbor);
    }
  }
  return order.length === nodes.length ? order : null;
}

module.exports = { topoSort };
