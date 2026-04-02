const analyticsState = {
  cohort: "today" as "today" | "week" | "month",
  throughput: [
    { label: "processed", value: 182 },
    { label: "escalated", value: 14 }
  ],
  falsePositives: [
    { label: "model-a", value: 3 },
    { label: "model-b", value: 5 }
  ],
  cohortRisks: [
    { label: "new-accounts", value: 11 },
    { label: "appeal-overturns", value: 6 }
  ],
  lastMessage: "Analytics dashboards should connect operational throughput with quality signals such as false positives."
};

export function snapshot() {
  return structuredClone(analyticsState);
}

export function mutate(cohort: "today" | "week" | "month") {
  analyticsState.cohort = cohort;
  analyticsState.lastMessage = `Loaded ${cohort} cohort analytics.`;
  return snapshot();
}
