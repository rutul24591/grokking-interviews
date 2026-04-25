const { TreeNode, countNodes } = require("../example-1/tree");

const root = new TreeNode("n1");
let current = root;

for (let index = 2; index <= 5; index += 1) {
  const child = new TreeNode(`n${index}`);
  current.addChild(child);
  current = child;
}

console.log("Skewed node count:", countNodes(root));
console.log("Depth approximation:", 5);
console.log("Observation: lookup degenerates toward linear depth on a skewed tree.");
