class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function lowestCommonAncestor(root, p, q) {
  let cur = root;
  const low = Math.min(p.val, q.val);
  const high = Math.max(p.val, q.val);
  while (cur) {
    if (high < cur.val) cur = cur.left;
    else if (low > cur.val) cur = cur.right;
    else return cur;
  }
  return null;
}

if (require.main === module) {
  const root = new TreeNode(6);
  root.left = new TreeNode(2, new TreeNode(0), new TreeNode(4, new TreeNode(3), new TreeNode(5)));
  root.right = new TreeNode(8, new TreeNode(7), new TreeNode(9));
  const p = root.left;
  const q = root.right;
  console.log(lowestCommonAncestor(root, p, q).val);
}

module.exports = { TreeNode, lowestCommonAncestor };
