class TreeNode {
  constructor(name) {
    this.name = name;
    this.children = [];
  }

  addChild(node) {
    this.children.push(node);
  }
}

function depthFirst(node, visit) {
  visit(node);
  for (const child of node.children) depthFirst(child, visit);
}

function countNodes(node) {
  return 1 + node.children.reduce((sum, child) => sum + countNodes(child), 0);
}

module.exports = { TreeNode, depthFirst, countNodes };
