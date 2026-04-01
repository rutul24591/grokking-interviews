function derivativePlan(assetType, surfaces, accessibilityRequired) {
  const profiles = [];
  if (assetType === "video") profiles.push("1080p", "720p", "thumbnail");
  if (surfaces.includes("social")) profiles.push("social-square");
  if (accessibilityRequired) profiles.push("captions");
  return { profiles: [...new Set(profiles)], count: [...new Set(profiles)].length };
}

console.log(derivativePlan("video", ["web", "social"], true));
