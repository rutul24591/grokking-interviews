class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function lowestCommonAncestorBrute(root, p, q) {
  function pathTo(node, target, path) {
    if (!node) return false;
    path.push(node);
    if (node === target) return true;
    if (pathTo(node.left, target, path) || pathTo(node.right, target, path)) return true;
    path.pop();
    return false;
  }

  const pPath = [];
  const qPath = [];
  pathTo(root, p, pPath);
  pathTo(root, q, qPath);

  let i = 0;
  while (i < pPath.length && i < qPath.length && pPath[i] === qPath[i]) i += 1;
  return pPath[i - 1] || null;
}

if (require.main === module) {
  const root = new TreeNode(6);
  root.left = new TreeNode(2, new TreeNode(0), new TreeNode(4, new TreeNode(3), new TreeNode(5)));
  root.right = new TreeNode(8, new TreeNode(7), new TreeNode(9));
  const p = root.left;
  const q = root.right;
  console.log(lowestCommonAncestorBrute(root, p, q).val);
}

module.exports = { TreeNode, lowestCommonAncestorBrute };
