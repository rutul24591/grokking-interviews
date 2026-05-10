class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function levelOrderDFS(root) {
  const out = [];
  (function dfs(node, depth) {
    if (!node) return;
    if (out.length === depth) out.push([]);
    out[depth].push(node.val);
    dfs(node.left, depth + 1);
    dfs(node.right, depth + 1);
  })(root, 0);
  return out;
}

if (require.main === module) {
  const root = new TreeNode(3, new TreeNode(9), new TreeNode(20, new TreeNode(15), new TreeNode(7)));
  console.log(levelOrderDFS(root));
}

module.exports = { TreeNode, levelOrderDFS };
