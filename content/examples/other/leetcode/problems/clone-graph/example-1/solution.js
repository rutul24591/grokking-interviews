class Node {
  constructor(val, neighbors = []) {
    this.val = val;
    this.neighbors = neighbors;
  }
}

function cloneGraphDFS(node) {
  if (node == null) return null;
  const seen = new Map();

  function dfs(current) {
    if (seen.has(current)) return seen.get(current);
    const copy = new Node(current.val, []);
    seen.set(current, copy);
    for (const next of current.neighbors) copy.neighbors.push(dfs(next));
    return copy;
  }

  return dfs(node);
}

if (require.main === module) {
  const a = new Node(1);
  const b = new Node(2);
  a.neighbors = [b];
  b.neighbors = [a];
  const cloned = cloneGraphDFS(a);
  console.log(cloned.val, cloned.neighbors[0].val);
}

module.exports = { Node, cloneGraphDFS };
