function validateDocumentStructure(blocks) {
  const headingOneCount = blocks.filter((block) => block.type === "h1").length;
  const consecutiveCallouts = /callout,callout/.test(blocks.map((block) => block.type).join(","));
  return {
    valid: headingOneCount <= 1 && !consecutiveCallouts,
    issues: [headingOneCount > 1 ? "multiple-top-level-headings" : null, consecutiveCallouts ? "stacked-callouts" : null].filter(Boolean)
  };
}

console.log(validateDocumentStructure([{ type: "h1" }, { type: "h1" }, { type: "callout" }, { type: "callout" }]));
