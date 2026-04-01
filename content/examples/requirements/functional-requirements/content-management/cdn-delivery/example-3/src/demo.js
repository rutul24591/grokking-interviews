function failoverPlan(route) {
  if (route.originHealthy) {
    return { mode: "serve-cached", banner: "none", retryAtEdge: false };
  }
  if (route.hasRegionalCopy && route.stalenessSeconds <= route.maxStalenessSeconds) {
    return { mode: "regional-fallback", banner: "degraded-latency", retryAtEdge: true };
  }
  return { mode: "origin-retry", banner: "possible-failure", retryAtEdge: false };
}

console.log(failoverPlan({ originHealthy: false, hasRegionalCopy: true, stalenessSeconds: 40, maxStalenessSeconds: 60 }));
