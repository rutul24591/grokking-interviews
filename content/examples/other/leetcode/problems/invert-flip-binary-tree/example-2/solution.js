class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function invertTreeBFS(root) {
  if (!root) return null;
  const queue = [root];
  for (let qi = 0; qi < queue.length; qi += 1) {
    const node = queue[qi];
    [node.left, node.right] = [node.right, node.left];
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  return root;
}

if (require.main === module) {
  const root = new TreeNode(4, new TreeNode(2, new TreeNode(1), new TreeNode(3)), new TreeNode(7, new TreeNode(6), new TreeNode(9)));
  console.log(invertTreeBFS(root).left.val);
}

module.exports = { TreeNode, invertTreeBFS };
