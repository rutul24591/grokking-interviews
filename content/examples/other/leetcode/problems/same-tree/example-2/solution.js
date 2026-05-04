class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function isSameTreeIterative(p, q) {
  const stack = [[p, q]];
  while (stack.length > 0) {
    const [a, b] = stack.pop();
    if (a == null && b == null) continue;
    if (a == null || b == null) return false;
    if (a.val !== b.val) return false;
    stack.push([a.left, b.left], [a.right, b.right]);
  }
  return true;
}

if (require.main === module) {
  const p = new TreeNode(1, new TreeNode(2), new TreeNode(3));
  const q = new TreeNode(1, new TreeNode(2), new TreeNode(3));
  console.log(isSameTreeIterative(p, q));
}

module.exports = { TreeNode, isSameTreeIterative };
