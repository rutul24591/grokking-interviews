function prioritizeDashboardModules(widgets, role, viewport) {
  return widgets
    .filter((widget) => role === "super-admin" || !widget.adminOnly)
    .sort((left, right) => right.severity - left.severity || right.updateFrequency - left.updateFrequency)
    .slice(0, viewport === "compact" ? 2 : 4)
    .map((widget) => ({
      id: widget.id,
      placement: widget.severity >= 9 ? "top-row" : "secondary-row"
    }));
}

console.log(
  prioritizeDashboardModules(
    [
      { id: "queues", severity: 9, adminOnly: false, updateFrequency: 10 },
      { id: "billing", severity: 4, adminOnly: true, updateFrequency: 2 },
      { id: "alerts", severity: 10, adminOnly: false, updateFrequency: 12 },
      { id: "appeals", severity: 7, adminOnly: false, updateFrequency: 6 }
    ],
    "reviewer",
    "compact"
  )
);
