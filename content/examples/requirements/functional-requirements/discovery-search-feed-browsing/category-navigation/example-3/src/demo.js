function categoryHealth(nodes) {
  return nodes.map((node) => ({
    id: node.id,
    orphanedChildren: node.children.filter((child) => !node.allowedChildren.includes(child))
  }));
}

console.log(categoryHealth([{ id: "frontend", children: ["rendering", "ghost"], allowedChildren: ["rendering", "performance"] }]));
