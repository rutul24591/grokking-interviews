export const rollbackCases = [
  {
    id: "asset-regression",
    label: "Asset regression rollback",
    state: "healthy",
    blastRadius: "Broken hero assets on homepage",
    preferredLane: "Revert CDN manifest and previous frontend artifact together",
    notes: [
      "Rollback must restore both HTML and asset manifest references.",
      "Keep the previous artifact and CDN manifest versioned together.",
      "Invalidate caches only after the stable artifact is serving again."
    ]
  },
  {
    id: "schema-drift",
    label: "Schema compatibility concern",
    state: "watch",
    blastRadius: "Checkout UI depends on a new API field",
    preferredLane: "Use compatibility layer before frontend rollback",
    notes: [
      "Check whether the old frontend can still speak to the current backend contract.",
      "Prefer reversible compatibility shims over emergency rewrites.",
      "Do not trigger rollback if the data contract itself is now incompatible."
    ]
  },
  {
    id: "session-loss",
    label: "Active session failure",
    state: "repair",
    blastRadius: "Logged-in users are being forced through broken refresh loops",
    preferredLane: "Immediate traffic rollback with session preservation",
    notes: [
      "Treat login-loop regressions as an immediate rollback trigger.",
      "Preserve cookie and session compatibility during rollback.",
      "Capture customer session impact before the next release attempt."
    ]
  }
] as const;

export const rollbackPolicy = [
  "The rollback lane must restore the whole customer path, not just the frontend bundle.",
  "Artifact, config, and cache state need one coherent reversal plan.",
  "A rollback that breaks sessions is still a failed release response."
] as const;
