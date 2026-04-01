function taxonomyFallback(primaryCategory, secondaryCategory, allowedSecondary, fallbackCategory) {
  const valid = allowedSecondary.includes(secondaryCategory);
  return {
    valid,
    resolvedCategory: valid ? secondaryCategory : fallbackCategory,
    action: valid ? "keep-selection" : "move-to-fallback-and-notify"
  };
}

console.log(taxonomyFallback("Frontend", "Messaging", ["Rendering", "State"], "Unclassified"));
