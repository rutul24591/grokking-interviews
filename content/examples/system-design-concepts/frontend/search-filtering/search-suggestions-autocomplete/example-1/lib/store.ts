export const autocompleteScenarios = [
  {
    id: "healthy-suggest",
    label: "Healthy suggestions",
    query: "load",
    suggestionCount: 6,
    rankingMode: "prefix+history",
    keyboardState: "stable",
    staleSuggestionRisk: false
  },
  {
    id: "slow-suggest",
    label: "Slow suggestion service",
    query: "dist",
    suggestionCount: 4,
    rankingMode: "prefix-only",
    keyboardState: "lagging",
    staleSuggestionRisk: true
  },
  {
    id: "broken-focus",
    label: "Broken focus management",
    query: "cache",
    suggestionCount: 8,
    rankingMode: "history-heavy",
    keyboardState: "repair",
    staleSuggestionRisk: true
  }
] as const;

export const autocompletePolicies = [
  "Gate suggestions by query length so noise does not overwhelm the result surface.",
  "Preserve keyboard focus and active option state independently from the network response.",
  "Treat stale suggestions as a correctness issue when they no longer match the visible query.",
  "Combine history boosts carefully so they do not bury stronger prefix matches."
];

export const autocompleteRecovery = [
  { issue: "Stale suggestions", action: "Drop results whose query token no longer matches the active input value." },
  { issue: "Keyboard drift", action: "Pin the active option id and restore focus after the next suggestion render." },
  { issue: "History overboost", action: "Reduce history weight so fresh prefix matches stay visible." }
];
