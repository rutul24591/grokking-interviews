class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function levelOrderBFS(root) {
  if (!root) return [];
  const out = [];
  const queue = [root];
  for (let qi = 0; qi < queue.length; ) {
    const levelSize = queue.length - qi;
    const level = [];
    for (let i = 0; i < levelSize; i += 1) {
      const node = queue[qi++];
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    out.push(level);
  }
  return out;
}

if (require.main === module) {
  const root = new TreeNode(3, new TreeNode(9), new TreeNode(20, new TreeNode(15), new TreeNode(7)));
  console.log(levelOrderBFS(root));
}

module.exports = { TreeNode, levelOrderBFS };
