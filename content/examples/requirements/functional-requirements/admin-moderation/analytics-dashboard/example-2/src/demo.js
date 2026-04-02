function buildEfficiencySummary(cohorts) {
  return cohorts.map((cohort) => {
    const qualityPenalty = cohort.falsePositives * 5 + cohort.overturnedEscalations * 3;
    return {
      cohort: cohort.name,
      score: Math.max(cohort.processed - qualityPenalty, 0),
      qualityPenalty,
      recommendation: qualityPenalty > 40 ? "review-model-thresholds" : "healthy"
    };
  });
}

console.log(
  buildEfficiencySummary([
    { name: "today", processed: 182, falsePositives: 5, overturnedEscalations: 3 },
    { name: "weekend", processed: 94, falsePositives: 9, overturnedEscalations: 4 }
  ])
);
