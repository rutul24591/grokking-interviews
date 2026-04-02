function detectReporterAbuse(reporters) {
  const abusive = reporters
    .filter((reporter) => (reporter.falsePositiveRate > 0.7 && reporter.volume > 20) || reporter.targetConcentration > 0.8)
    .map((reporter) => reporter.id);
  return {
    abusive,
    throttle: abusive.length > 0,
    requireTrustReview: abusive.length > 0
  };
}

console.log(
  detectReporterAbuse([
    { id: "r-1", falsePositiveRate: 0.18, volume: 4, targetConcentration: 0.2 },
    { id: "r-2", falsePositiveRate: 0.81, volume: 33, targetConcentration: 0.92 }
  ])
);
