function previewGate(variants) {
  const blocking = variants.filter((variant) => variant.status === "missing-media" || variant.imageState === "missing");
  const warnings = variants.filter((variant) => variant.status === "warning" || variant.imageState === "cropped");
  return {
    publishBlocked: blocking.length > 0,
    blockingSurfaces: blocking.map((variant) => variant.surface),
    warnings: warnings.map((variant) => variant.surface)
  };
}

console.log(
  previewGate([
    { surface: "web", status: "ready", imageState: "ready" },
    { surface: "mobile", status: "warning", imageState: "cropped" },
    { surface: "social", status: "missing-media", imageState: "missing" }
  ])
);
