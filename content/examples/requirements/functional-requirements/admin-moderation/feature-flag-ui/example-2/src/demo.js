function rolloutPlan(segments, rolloutPercent) {
  return segments.map((segment) => ({
    segment: segment.name,
    enabled: segment.bucket < rolloutPercent,
    needsManualReview: segment.region === "EU" || segment.adminSurface
  }));
}

console.log(
  rolloutPlan(
    [
      { name: "trust-admins", bucket: 18, region: "US", adminSurface: true },
      { name: "queue-reviewers", bucket: 41, region: "EU", adminSurface: false }
    ],
    25
  )
);
