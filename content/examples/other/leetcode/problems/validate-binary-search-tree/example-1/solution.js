class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function isValidBSTInorderList(root) {
  const values = [];
  (function inorder(node) {
    if (!node) return;
    inorder(node.left);
    values.push(node.val);
    inorder(node.right);
  })(root);

  for (let i = 1; i < values.length; i += 1) {
    if (values[i] <= values[i - 1]) return false;
  }
  return true;
}

if (require.main === module) {
  const ok = new TreeNode(2, new TreeNode(1), new TreeNode(3));
  console.log(isValidBSTInorderList(ok));
}

module.exports = { TreeNode, isValidBSTInorderList };
