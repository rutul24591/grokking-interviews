function detectMetricInconsistency(surfaces) {
  const inconsistent = surfaces.filter((surface) => surface.inlineValue !== surface.detailValue).map((surface) => surface.metric);
  const stale = surfaces.filter((surface) => surface.freshnessMinutes > surface.maxFreshness).map((surface) => surface.metric);
  return {
    inconsistent,
    stale,
    degradeToApproximate: inconsistent.length > 0 || stale.length > 0,
    hideTrendArrow: surfaces.some((surface) => surface.baseline === 0)
  };
}

console.log(detectMetricInconsistency([
  { metric: "likes", inlineValue: 99, detailValue: 104, freshnessMinutes: 2, maxFreshness: 10, baseline: 91 },
  { metric: "comments", inlineValue: 12, detailValue: 12, freshnessMinutes: 14, maxFreshness: 5, baseline: 0 }
]));
