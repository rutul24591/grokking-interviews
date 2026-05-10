class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function serializePreorder(root) {
  const out = [];
  (function dfs(node) {
    if (!node) {
      out.push("#");
      return;
    }
    out.push(String(node.val));
    dfs(node.left);
    dfs(node.right);
  })(root);
  return out.join(",");
}

function isSubtreeSerialized(root, subRoot) {
  const a = serializePreorder(root);
  const b = serializePreorder(subRoot);
  return a.includes(b);
}

if (require.main === module) {
  const root = new TreeNode(3, new TreeNode(4, new TreeNode(1), new TreeNode(2)), new TreeNode(5));
  const sub = new TreeNode(4, new TreeNode(1), new TreeNode(2));
  console.log(isSubtreeSerialized(root, sub));
}

module.exports = { TreeNode, isSubtreeSerialized };
