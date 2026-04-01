function fallbackTier(feature) {
  if (feature.critical && feature.hasManualFallback) {
    return { tier: "manual-fallback", banner: "page" };
  }

  if (feature.critical) {
    return { tier: "retry-and-block", banner: "global" };
  }

  return { tier: "local-fallback", banner: "none" };
}

console.log(fallbackTier({ critical: true, hasManualFallback: true }));
