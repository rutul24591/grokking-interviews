function detectTranslationBundleFailure({ bundleStatus, hasNamespaceFallback, routeIsCritical, missingKeys }) {
  return {
    blockRoute: bundleStatus === "missing" && routeIsCritical && !hasNamespaceFallback,
    showFallback: bundleStatus !== "loaded" && hasNamespaceFallback,
    logMissingKeyCount: missingKeys,
    reason: bundleStatus === "missing" ? "missing-bundle" : bundleStatus === "timeout" ? "bundle-timeout" : "loaded"
  };
}

console.log([
  { bundleStatus: "missing", hasNamespaceFallback: true, routeIsCritical: true, missingKeys: 12 },
  { bundleStatus: "timeout", hasNamespaceFallback: false, routeIsCritical: false, missingKeys: 0 },
  { bundleStatus: "loaded", hasNamespaceFallback: false, routeIsCritical: true, missingKeys: 3 }
].map(detectTranslationBundleFailure));
