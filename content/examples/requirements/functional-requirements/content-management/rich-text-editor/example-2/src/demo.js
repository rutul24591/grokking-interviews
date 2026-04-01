function formatDecision(selection, format, currentBlockType) {
  return {
    allowed: selection.length > 0 || format === "paragraph",
    transformsBlock: currentBlockType !== format,
    reason: selection.length > 0 || format === "paragraph" ? "allowed" : "selection-required"
  };
}

console.log(formatDecision("headline", "heading", "paragraph"));
