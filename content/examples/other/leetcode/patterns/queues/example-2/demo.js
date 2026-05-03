function levelOrder(root) {
  if (!root) return [];
  const q = [root];
  const levels = [];
  while (q.length) {
    const size = q.length;
    const level = [];
    for (let i = 0; i < size; i += 1) {
      const node = q.shift();
      level.push(node.value);
      for (const child of node.children ?? []) q.push(child);
    }
    levels.push(level);
  }
  return levels;
}

const tree = { value: 1, children: [{ value: 2, children: [] }, { value: 3, children: [{ value: 4, children: [] }] }] };
console.log(levelOrder(tree));
