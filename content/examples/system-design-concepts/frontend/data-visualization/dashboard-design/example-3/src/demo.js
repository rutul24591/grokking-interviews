function fallbackForPanel(panel) {
  if (panel.status === "stale" && panel.priority === "high") {
    return { action: "annotate-staleness", keepVisible: true, banner: "inline-warning" };
  }

  if (panel.status === "degraded" && panel.priority === "low") {
    return { action: "collapse-panel", keepVisible: false, banner: "none" };
  }

  if (panel.status === "degraded" && panel.priority !== "low") {
    return { action: "render-skeleton-summary", keepVisible: true, banner: "service-degraded" };
  }

  return { action: "render-normal", keepVisible: true, banner: "none" };
}

console.log(fallbackForPanel({ status: "degraded", priority: "medium" }));
