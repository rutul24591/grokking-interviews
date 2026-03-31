function orphaned(sections, parents) {
  return sections
    .filter((section) => !parents.includes(section.parent))
    .map((section) => ({ ...section, failure: "missing-parent-layout" }));
}

console.log(orphaned([{ parent: "frontend", child: "routing" }, { parent: "mobile", child: "gestures" }], ["frontend", "backend"]));
