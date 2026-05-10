class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function isSame(a, b) {
  if (!a && !b) return true;
  if (!a || !b) return false;
  if (a.val !== b.val) return false;
  return isSame(a.left, b.left) && isSame(a.right, b.right);
}

function isSubtreeBrute(root, subRoot) {
  if (!subRoot) return true;
  if (!root) return false;
  if (isSame(root, subRoot)) return true;
  return isSubtreeBrute(root.left, subRoot) || isSubtreeBrute(root.right, subRoot);
}

if (require.main === module) {
  const root = new TreeNode(3, new TreeNode(4, new TreeNode(1), new TreeNode(2)), new TreeNode(5));
  const sub = new TreeNode(4, new TreeNode(1), new TreeNode(2));
  console.log(isSubtreeBrute(root, sub));
}

module.exports = { TreeNode, isSubtreeBrute };
