function interactionStrategy(scene) {
  if (scene.renderer === "canvas" && scene.requiresPerPointTooltips && scene.pointCount > 8000) {
    return {
      strategy: "spatial-index-overlay",
      risk: "tooltip-hit-testing-cost",
      mitigation: "bucket-hover-targets-before-point-resolution"
    };
  }

  if (scene.renderer === "svg" && scene.pointCount > 4000) {
    return {
      strategy: "virtualize-or-aggregate",
      risk: "dom-node-explosion",
      mitigation: "render-summary-layer-until-zoom-threshold"
    };
  }

  return { strategy: "direct-hit-targets", risk: "low", mitigation: "none" };
}

console.log(interactionStrategy({ renderer: "canvas", requiresPerPointTooltips: true, pointCount: 15000 }));
