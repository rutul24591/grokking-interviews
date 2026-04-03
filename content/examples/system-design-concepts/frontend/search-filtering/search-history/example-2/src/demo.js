function chooseHistoryPlan(scenario) {
  const actions = [];
  if (!scenario.privateMode) actions.push("allow-persisted-reuse");
  if (scenario.dedupeState === "overfull") actions.push("trim-oldest-non-pinned");
  if (scenario.pinnedQueries > 0) actions.push("keep-pinned-separate");
  if (scenario.sensitiveTermsPresent) actions.push("suppress-history-boosts");

  return {
    id: scenario.id,
    persistHistory: !scenario.privateMode,
    trimEntries: scenario.dedupeState === "overfull",
    keepPinnedSeparate: scenario.pinnedQueries > 0,
    actions
  };
}

const scenarios = [
  { id: "healthy", privateMode: false, dedupeState: "healthy", pinnedQueries: 1, sensitiveTermsPresent: false },
  { id: "overfull", privateMode: false, dedupeState: "overfull", pinnedQueries: 2, sensitiveTermsPresent: false },
  { id: "private", privateMode: true, dedupeState: "leaking", pinnedQueries: 0, sensitiveTermsPresent: true }
];

const plans = scenarios.map(chooseHistoryPlan);
console.log(plans);
console.log({ persistenceAllowed: plans.filter((item) => item.persistHistory).length, privacySuppressions: plans.filter((item) => item.actions.includes("suppress-history-boosts")).length });
