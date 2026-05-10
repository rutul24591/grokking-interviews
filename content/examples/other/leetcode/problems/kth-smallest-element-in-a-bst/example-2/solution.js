class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function kthSmallest(root, k) {
  const stack = [];
  let cur = root;
  while (cur || stack.length) {
    while (cur) {
      stack.push(cur);
      cur = cur.left;
    }
    cur = stack.pop();
    k -= 1;
    if (k === 0) return cur.val;
    cur = cur.right;
  }
  return null;
}

if (require.main === module) {
  const root = new TreeNode(3, new TreeNode(1, null, new TreeNode(2)), new TreeNode(4));
  console.log(kthSmallest(root, 1));
}

module.exports = { TreeNode, kthSmallest };
