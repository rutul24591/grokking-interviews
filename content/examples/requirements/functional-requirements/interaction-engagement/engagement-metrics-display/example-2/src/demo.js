function metricDisplayPolicy(metrics) {
  return metrics.map((metric) => ({
    id: metric.id,
    showTrend: metric.baseline > 0,
    compactNotation: metric.value >= 1000,
    approximateBadge: metric.freshnessMinutes > metric.maxFreshness,
    hideInline: metric.privacyThreshold > metric.value
  }));
}

console.log(metricDisplayPolicy([
  { id: "likes", value: 148, baseline: 120, freshnessMinutes: 3, maxFreshness: 5, privacyThreshold: 0 },
  { id: "shares", value: 3900, baseline: 0, freshnessMinutes: 17, maxFreshness: 10, privacyThreshold: 5000 }
]));
