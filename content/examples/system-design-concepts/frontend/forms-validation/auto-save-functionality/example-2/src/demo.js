function planAutosaveScenario(scenario) {
  if (scenario.dirtyFields.length === 0) return { scenario: scenario.name, action: "idle", reason: "no-dirty-fields" };
  if (scenario.network === "offline") return { scenario: scenario.name, action: "queue-local", reason: "network-offline" };
  if (scenario.reviewRequired) return { scenario: scenario.name, action: "pause", reason: "merge-review-required" };
  if (scenario.savePolicy === "manual-review") return { scenario: scenario.name, action: "hold", reason: "manual-review-policy" };
  return { scenario: scenario.name, action: "autosave-now", reason: `save-${scenario.dirtyFields.length}-field(s)` };
}

const scenarios = [
  { name: "healthy-idle", dirtyFields: ["summary", "impact"], network: "healthy", reviewRequired: false, savePolicy: "idle" },
  { name: "offline-backlog", dirtyFields: ["summary"], network: "offline", reviewRequired: false, savePolicy: "idle" },
  { name: "merge-review", dirtyFields: ["impact", "actions"], network: "healthy", reviewRequired: true, savePolicy: "idle" }
];

console.log(scenarios.map(planAutosaveScenario));
