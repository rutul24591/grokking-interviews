class Node {
  constructor(val, neighbors = []) {
    this.val = val;
    this.neighbors = neighbors;
  }
}

function cloneGraphBFS(node) {
  if (node == null) return null;
  const seen = new Map();
  const queue = [node];
  seen.set(node, new Node(node.val, []));

  for (let qi = 0; qi < queue.length; qi += 1) {
    const cur = queue[qi];
    const copy = seen.get(cur);
    for (const nxt of cur.neighbors) {
      if (!seen.has(nxt)) {
        seen.set(nxt, new Node(nxt.val, []));
        queue.push(nxt);
      }
      copy.neighbors.push(seen.get(nxt));
    }
  }

  return seen.get(node);
}

if (require.main === module) {
  const a = new Node(1);
  const b = new Node(2);
  a.neighbors = [b];
  b.neighbors = [a];
  const cloned = cloneGraphBFS(a);
  console.log(cloned.val, cloned.neighbors[0].val);
}

module.exports = { Node, cloneGraphBFS };
