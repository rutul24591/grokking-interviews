function detectShareEdgeCases(targets) {
  const unavailable = targets.filter((target) => target.selected && target.available === false).map((target) => target.id);
  const brokenMetadata = targets.filter((target) => target.selected && !target.hasPreviewCard).map((target) => target.id);
  return {
    unavailable,
    brokenMetadata,
    fallbackToCopy: unavailable.length > 0,
    stripPreviewImage: brokenMetadata.length > 0
  };
}

console.log(detectShareEdgeCases([
  { id: "slack", selected: true, available: false, hasPreviewCard: false },
  { id: "native", selected: false, available: true, hasPreviewCard: true }
]));
