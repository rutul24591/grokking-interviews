class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function serializeBFS(root) {
  if (!root) return "";
  const out = [];
  const queue = [root];
  for (let qi = 0; qi < queue.length; qi += 1) {
    const node = queue[qi];
    if (!node) {
      out.push("#");
      continue;
    }
    out.push(String(node.val));
    queue.push(node.left);
    queue.push(node.right);
  }
  // trim trailing nulls
  while (out.length > 0 && out[out.length - 1] === "#") out.pop();
  return out.join(",");
}

function deserializeBFS(data) {
  if (!data) return null;
  const parts = data.split(",");
  const root = new TreeNode(Number(parts[0]));
  const queue = [root];
  let i = 1;
  for (let qi = 0; qi < queue.length && i < parts.length; qi += 1) {
    const node = queue[qi];
    const left = parts[i++];
    if (left !== undefined) {
      if (left !== "#") node.left = new TreeNode(Number(left));
      queue.push(node.left || null);
    }
    const right = parts[i++];
    if (right !== undefined) {
      if (right !== "#") node.right = new TreeNode(Number(right));
      queue.push(node.right || null);
    }
  }
  return root;
}

if (require.main === module) {
  const root = new TreeNode(1, new TreeNode(2), new TreeNode(3, new TreeNode(4), new TreeNode(5)));
  const s = serializeBFS(root);
  console.log(s);
  console.log(serializeBFS(deserializeBFS(s)));
}

module.exports = { TreeNode, serializeBFS, deserializeBFS };
