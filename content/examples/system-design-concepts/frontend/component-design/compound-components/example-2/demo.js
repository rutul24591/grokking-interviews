function validateCompoundTree(nodes) {
  return nodes.map((node) => ({
    ...node,
    valid: node.parent === "Tabs",
    reason: node.parent === "Tabs" ? "registered with shared parent" : `${node.type} is outside Tabs provider`
  }));
}

console.log(validateCompoundTree([{ type: "Tab", parent: "Tabs" }, { type: "TabPanels", parent: "Tabs" }]));
console.log(validateCompoundTree([{ type: "Tab", parent: "Tabs" }, { type: "TabPanel", parent: "Page" }]));
