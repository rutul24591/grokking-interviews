export const modules = [
  {
    id: "pricing-engine",
    label: "Pricing engine",
    owner: "Revenue platform",
    releaseGate: "Must pass before any pricing rollout",
    coverage: "Branch coverage 93%, mutation score 81%",
    risk: "healthy",
    finding: "Pure pricing helpers, tax rounding, and discount ordering are isolated and deterministic.",
    scenarios: [
      "Discount stack ordering across coupons and loyalty credits.",
      "Zero-decimal currencies and region-specific tax rounding.",
      "Fallback behavior when one optional promotion input is absent."
    ],
    actions: [
      "Keep fixture data minimal and deterministic.",
      "Run mutation testing on discount and tax helpers weekly.",
      "Fail fast when pricing helpers start depending on global runtime state."
    ]
  },
  {
    id: "search-ranking",
    label: "Search ranking helper",
    owner: "Discovery frontend",
    releaseGate: "Blocks ranking model rollout",
    coverage: "Branch coverage 78%, mutation score 49%",
    risk: "watch",
    finding: "Shared mocks and weak tie-break assertions can hide ranking drift that only appears in production ordering.",
    scenarios: [
      "Tie-break ordering when lexical score is equal.",
      "Fallback ranking when one weight map is stale.",
      "Local-state reset after one failed personalization lookup."
    ],
    actions: [
      "Reset mocks between every test run.",
      "Add explicit assertions for tie-break ordering and stale-weight fallback.",
      "Block release promotion until local and CI runs remain deterministic."
    ]
  },
  {
    id: "checkout-formatter",
    label: "Checkout formatter",
    owner: "Payments experience",
    releaseGate: "Required for payment UI release",
    coverage: "Branch coverage 61%, mutation score 32%",
    risk: "repair",
    finding: "Critical locale and money-format branches are still untested, so a green suite is not meaningful enough for release signoff.",
    scenarios: [
      "Locale-specific currency symbol and grouping rules.",
      "Zero-value and partial-refund representations.",
      "Mismatch between tax-included and tax-exclusive display modes."
    ],
    actions: [
      "Add branch-level tests for zero-decimal and locale-specific currencies.",
      "Split formatting helpers from rendering wrappers.",
      "Block shipment until money-format regressions are covered with deterministic assertions."
    ]
  }
] as const;

export const heuristics = [
  "Unit tests should fail on logic regressions, not pass because mocks are too broad.",
  "A small isolated suite is more valuable than a large coupled suite.",
  "Critical helpers need branch-level assertions, mutation resistance, and deterministic inputs."
] as const;
