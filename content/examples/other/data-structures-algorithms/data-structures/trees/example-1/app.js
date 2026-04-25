const { TreeNode, depthFirst, countNodes } = require("./tree");

const root = new TreeNode("Knowledge Base");
const frontend = new TreeNode("Frontend");
const backend = new TreeNode("Backend");
const caching = new TreeNode("Caching");
const rendering = new TreeNode("Rendering");

root.addChild(frontend);
root.addChild(backend);
frontend.addChild(rendering);
backend.addChild(caching);

const order = [];
depthFirst(root, (node) => order.push(node.name));

console.log("DFS order:", order.join(" -> "));
console.log("Tree size:", countNodes(root));
