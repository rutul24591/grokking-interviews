function bfsLevels(root) {
  if (!root) return [];
  const q = [root];
  const levels = [];
  while (q.length) {
    const size = q.length;
    const level = [];
    for (let i = 0; i < size; i += 1) {
      const node = q.shift();
      level.push(node.value);
      if (node.left) q.push(node.left);
      if (node.right) q.push(node.right);
    }
    levels.push(level);
  }
  return levels;
}

module.exports = { bfsLevels };
