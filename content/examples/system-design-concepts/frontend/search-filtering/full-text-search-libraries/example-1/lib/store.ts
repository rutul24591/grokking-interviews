export const libraryScenarios = [
  {
    id: "mini-index",
    label: "Mini search index",
    library: "MiniSearch",
    query: "distributed cache",
    weighting: "title-heavy",
    fuzziness: "low",
    stemming: true,
    falsePositiveRisk: false,
    docsIndexed: 6800,
    recallDelta: "+4% vs baseline",
    snippetHealth: "stable",
    rolloutAction: "Ship weighted-title search to the docs experience.",
    reviewOwners: ["Search relevance", "Docs platform"]
  },
  {
    id: "fuse-config",
    label: "Fuse.js config",
    library: "Fuse.js",
    query: "consisency",
    weighting: "summary-balanced",
    fuzziness: "high",
    stemming: false,
    falsePositiveRisk: true,
    docsIndexed: 12500,
    recallDelta: "+11% recall with noisy matches",
    snippetHealth: "repair",
    rolloutAction: "Hold rollout until typo tolerance stops burying the canonical result.",
    reviewOwners: ["Search relevance", "Editorial QA"]
  },
  {
    id: "lunr-upgrade",
    label: "Lunr upgrade",
    library: "Lunr",
    query: "leader election",
    weighting: "keyword-boosted",
    fuzziness: "medium",
    stemming: true,
    falsePositiveRisk: false,
    docsIndexed: 9100,
    recallDelta: "+6% on architecture terms",
    snippetHealth: "watch",
    rolloutAction: "Launch behind a docs-only flag and compare snippet alignment before broad rollout.",
    reviewOwners: ["Search relevance", "Frontend platform"]
  }
] as const;

export const libraryPolicies = [
  "Make weighting, stemming, and fuzziness explicit because each library defaults differently.",
  "Do not evaluate fuzzy match quality without comparing recall and noise together.",
  "Treat highlight mismatch and false positives as product regressions, not cosmetic defects.",
  "Keep a clear escape hatch when a lightweight library no longer fits the dataset or relevance goals."
];

export const libraryRecovery = [
  { issue: "False positives", action: "Lower fuzziness or tighten the weighted fields before exposing results broadly." },
  { issue: "Missing stemming", action: "Restore token normalization or expect poor recall on inflected terms." },
  { issue: "Highlight mismatch", action: "Fallback to plain snippets while token boundaries are corrected." }
];
