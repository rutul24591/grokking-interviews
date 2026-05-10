class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function kthSmallestInorderList(root, k) {
  const values = [];
  (function inorder(node) {
    if (!node) return;
    inorder(node.left);
    values.push(node.val);
    inorder(node.right);
  })(root);
  return values[k - 1];
}

if (require.main === module) {
  const root = new TreeNode(3, new TreeNode(1, null, new TreeNode(2)), new TreeNode(4));
  console.log(kthSmallestInorderList(root, 1));
}

module.exports = { TreeNode, kthSmallestInorderList };
