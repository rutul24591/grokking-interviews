function chooseRenderer(scene) {
  if (scene.requiresSemanticNodes || scene.requiresScreenReaderNavigation) {
    return {
      renderer: "svg",
      reason: "accessibility-and-dom-hit-targets",
      interactionModel: "dom-events"
    };
  }

  if (scene.pointCount > 5000 || scene.zoomPanDensity === "high") {
    return {
      renderer: "canvas",
      reason: "draw-throughput-and-density",
      interactionModel: scene.requiresPerPointTooltip ? "overlay-hit-testing" : "region-summary"
    };
  }

  return {
    renderer: "svg",
    reason: "moderate-scene-size",
    interactionModel: "dom-events"
  };
}

console.log(
  chooseRenderer({
    pointCount: 12000,
    requiresSemanticNodes: false,
    requiresScreenReaderNavigation: false,
    requiresPerPointTooltip: true,
    zoomPanDensity: "high"
  })
);
