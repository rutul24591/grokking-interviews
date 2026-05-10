class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function maxDepthBFS(root) {
  if (!root) return 0;
  const queue = [root];
  let depth = 0;
  for (let qi = 0; qi < queue.length; ) {
    const levelSize = queue.length - qi;
    for (let i = 0; i < levelSize; i += 1) {
      const node = queue[qi++];
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    depth += 1;
  }
  return depth;
}

if (require.main === module) {
  const root = new TreeNode(3, new TreeNode(9), new TreeNode(20, new TreeNode(15), new TreeNode(7)));
  console.log(maxDepthBFS(root));
}

module.exports = { TreeNode, maxDepthBFS };
