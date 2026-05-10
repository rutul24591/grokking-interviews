class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function serializeDFS(root) {
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

function deserializeDFS(data) {
  if (!data) return null;
  const parts = data.split(",");
  let i = 0;
  function build() {
    if (i >= parts.length) return null;
    const token = parts[i++];
    if (token === "#") return null;
    const node = new TreeNode(Number(token));
    node.left = build();
    node.right = build();
    return node;
  }
  return build();
}

if (require.main === module) {
  const root = new TreeNode(1, new TreeNode(2), new TreeNode(3, new TreeNode(4), new TreeNode(5)));
  const s = serializeDFS(root);
  console.log(s);
  console.log(serializeDFS(deserializeDFS(s)));
}

module.exports = { TreeNode, serializeDFS, deserializeDFS };
