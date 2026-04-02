function detectCohortRisk(cohorts) {
  const degraded = cohorts
    .filter((cohort) => cohort.falsePositiveRate > cohort.threshold || cohort.appealOverturnRate > cohort.appealThreshold)
    .map((cohort) => cohort.name);

  return {
    degraded,
    hiddenByAggregate: degraded.length > 0 && cohorts.some((cohort) => cohort.aggregateLooksHealthy),
    recommendSliceReview: degraded.length > 0
  };
}

console.log(
  detectCohortRisk([
    { name: "weekend", falsePositiveRate: 0.18, threshold: 0.1, appealOverturnRate: 0.12, appealThreshold: 0.08, aggregateLooksHealthy: true },
    { name: "weekday", falsePositiveRate: 0.05, threshold: 0.1, appealOverturnRate: 0.03, appealThreshold: 0.08, aggregateLooksHealthy: true }
  ])
);
