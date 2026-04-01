function prioritizePanels(panels, slotCount) {
  const weight = { high: 0, medium: 1, low: 2 };
  return [...panels]
    .sort((left, right) => {
      const priorityDelta = weight[left.priority] - weight[right.priority];
      return priorityDelta !== 0 ? priorityDelta : Number(left.stale) - Number(right.stale);
    })
    .slice(0, slotCount)
    .map((panel) => ({ id: panel.id, reason: panel.stale ? "priority-kept-despite-staleness" : "fresh-and-prioritized" }));
}

console.log(
  prioritizePanels(
    [
      { id: "kpi", priority: "high", stale: false },
      { id: "alerts", priority: "medium", stale: false },
      { id: "engagement", priority: "high", stale: true },
      { id: "longtail", priority: "low", stale: false }
    ],
    2
  )
);
