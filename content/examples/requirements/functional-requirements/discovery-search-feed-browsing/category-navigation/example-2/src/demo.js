function breadcrumbPath(tree, categoryId, childId) {
  const category = tree.find((node) => node.id === categoryId);
  return category && category.children.includes(childId)
    ? ["System Design", category.label, childId]
    : [];
}

console.log(breadcrumbPath([{ id: "frontend", label: "Frontend", children: ["rendering", "performance"] }], "frontend", "rendering"));
console.log(breadcrumbPath([{ id: "frontend", label: "Frontend", children: ["rendering"] }], "frontend", "storage"));
