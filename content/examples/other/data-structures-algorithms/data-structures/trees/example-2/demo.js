const { TreeNode } = require("../example-1/tree");

const root = new TreeNode("root");
root.addChild(new TreeNode("left"));
root.addChild(new TreeNode("right"));
root.children[0].addChild(new TreeNode("left.left"));

function breadthFirst(node) {
  const queue = [node];
  const order = [];
  while (queue.length) {
    const current = queue.shift();
    order.push(current.name);
    queue.push(...current.children);
  }
  return order;
}

console.log("BFS:", breadthFirst(root));
console.log("DFS-like preorder:", ["root", "left", "left.left", "right"]);
