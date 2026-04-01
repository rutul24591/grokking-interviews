function cachePolicyPlan(assets) {
  return assets.map((asset) => {
    const scope = asset.volatility === "low" && asset.sizeCategory === "large"
      ? "edge"
      : asset.volatility === "high"
        ? "regional"
        : "origin";
    const ttlSeconds = scope === "edge" ? 3600 : scope === "regional" ? 120 : 30;
    return { asset: asset.name, scope, ttlSeconds, warmupRequired: scope === "edge" && asset.popularity === "spiky" };
  });
}

console.log(cachePolicyPlan([
  { name: "hero-video", volatility: "low", sizeCategory: "large", popularity: "spiky" },
  { name: "share-card", volatility: "high", sizeCategory: "small", popularity: "steady" }
]));
