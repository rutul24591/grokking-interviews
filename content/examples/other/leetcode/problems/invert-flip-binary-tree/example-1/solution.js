class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function invertTreeRecursive(root) {
  if (!root) return null;
  const left = invertTreeRecursive(root.left);
  const right = invertTreeRecursive(root.right);
  root.left = right;
  root.right = left;
  return root;
}

if (require.main === module) {
  const root = new TreeNode(4, new TreeNode(2, new TreeNode(1), new TreeNode(3)), new TreeNode(7, new TreeNode(6), new TreeNode(9)));
  console.log(invertTreeRecursive(root).left.val);
}

module.exports = { TreeNode, invertTreeRecursive };
