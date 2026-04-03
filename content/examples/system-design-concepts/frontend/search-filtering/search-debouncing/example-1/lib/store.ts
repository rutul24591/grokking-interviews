export const debounceSessions = [
  {
    id: "steady-typing",
    label: "Steady typing",
    debounceMs: 300,
    requestState: "healthy",
    keystrokeBurst: 4,
    cancellationState: "active",
    staleResponseRisk: false,
    lastPaintMs: 72,
    inflightRequests: 1,
    backendBudgetMs: 160,
    releaseAction: "Keep live search enabled for the default docs experience.",
    qaFocus: ["typing cadence", "keyboard navigation"]
  },
  {
    id: "burst-typing",
    label: "Burst typing",
    debounceMs: 450,
    requestState: "lagging",
    keystrokeBurst: 9,
    cancellationState: "queued",
    staleResponseRisk: true,
    lastPaintMs: 190,
    inflightRequests: 3,
    backendBudgetMs: 180,
    releaseAction: "Gate rollout behind pending-state telemetry until burst behavior stabilizes.",
    qaFocus: ["cancellation", "pending indicator", "out-of-order responses"]
  },
  {
    id: "broken-ordering",
    label: "Broken ordering",
    debounceMs: 150,
    requestState: "repair",
    keystrokeBurst: 6,
    cancellationState: "missing",
    staleResponseRisk: true,
    lastPaintMs: 220,
    inflightRequests: 4,
    backendBudgetMs: 150,
    releaseAction: "Do not ship until query-id pinning and stale-response guards are restored.",
    qaFocus: ["response ordering", "render rollback"]
  }
] as const;

export const debouncePolicies = [
  "Separate typing cadence from request cadence so users can understand why results lag.",
  "Cancel obsolete requests before rendering the next result set.",
  "Treat out-of-order responses as correctness failures, not minor UX bugs.",
  "Tune debounce windows against both backend load and typing responsiveness."
];

export const debounceRecovery = [
  { issue: "Missing cancellation", action: "Discard obsolete requests before allowing their responses to paint the UI." },
  { issue: "Burst typing overload", action: "Raise debounce slightly and batch the request queue." },
  { issue: "Stale response", action: "Pin the active query id and reject mismatched responses during render." }
];
