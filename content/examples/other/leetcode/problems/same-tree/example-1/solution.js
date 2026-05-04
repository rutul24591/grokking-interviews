class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function isSameTreeRecursive(p, q) {
  if (p == null && q == null) return true;
  if (p == null || q == null) return false;
  if (p.val !== q.val) return false;
  return isSameTreeRecursive(p.left, q.left) && isSameTreeRecursive(p.right, q.right);
}

if (require.main === module) {
  const p = new TreeNode(1, new TreeNode(2), new TreeNode(3));
  const q = new TreeNode(1, new TreeNode(2), new TreeNode(3));
  console.log(isSameTreeRecursive(p, q));
}

module.exports = { TreeNode, isSameTreeRecursive };
