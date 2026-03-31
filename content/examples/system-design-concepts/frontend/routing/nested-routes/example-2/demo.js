function childrenFor(sections, parent) {
  return {
    parent,
    children: sections.filter((section) => section.parent === parent).map((section) => section.child),
    hasDefaultChild: sections.some((section) => section.parent === parent && section.isDefault)
  };
}

console.log(childrenFor([{ parent: "frontend", child: "routing", isDefault: true }, { parent: "backend", child: "storage", isDefault: false }], "frontend"));
