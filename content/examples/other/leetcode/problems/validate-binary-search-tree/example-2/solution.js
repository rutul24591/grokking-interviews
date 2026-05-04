class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function isValidBST(root) {
  function dfs(node, low, high) {
    if (!node) return true;
    if (!(low < node.val && node.val < high)) return false;
    return dfs(node.left, low, node.val) && dfs(node.right, node.val, high);
  }
  return dfs(root, -Infinity, Infinity);
}

if (require.main === module) {
  const ok = new TreeNode(2, new TreeNode(1), new TreeNode(3));
  console.log(isValidBST(ok));
}

module.exports = { TreeNode, isValidBST };
