function detectAggregationGaps(views) {
  const inconsistent = views.filter((view) => view.listCount !== view.detailCount).map((view) => view.entityId);
  const staleWindows = views.filter((view) => view.rebuildAgeMinutes > view.maxRebuildAge).map((view) => view.entityId);
  return {
    inconsistent,
    staleWindows,
    triggerRebuild: inconsistent.length > 0 || staleWindows.length > 0,
    hideApproximateBadge: inconsistent.length === 0 && staleWindows.length === 0
  };
}

console.log(detectAggregationGaps([
  { entityId: "post-1", listCount: 19, detailCount: 22, rebuildAgeMinutes: 3, maxRebuildAge: 10 },
  { entityId: "post-2", listCount: 8, detailCount: 8, rebuildAgeMinutes: 45, maxRebuildAge: 20 }
]));
