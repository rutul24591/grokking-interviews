function bannerDecision(capabilities, threshold) {
  const degradedCritical = capabilities.filter((capability) => capability.mode === "degraded" && capability.critical);
  return degradedCritical.length >= threshold
    ? { scope: "global-banner", affectedJourneys: degradedCritical.map((capability) => capability.journey) }
    : { scope: "local-inline-notice", affectedJourneys: degradedCritical.map((capability) => capability.journey) };
}

console.log(
  bannerDecision(
    [
      { mode: "degraded", critical: true, journey: "comments" },
      { mode: "degraded", critical: true, journey: "share" },
      { mode: "full", critical: false, journey: "search" }
    ],
    2
  )
);
