export const editingSessions = [
  {
    id: "incident-runbook",
    label: "Incident runbook",
    localUser: "Riya",
    presence: 4,
    pendingOps: 2,
    localCursor: "Step 6",
    remoteCursors: ["Ops lead on Step 4", "SRE on Summary"],
    syncHealth: "healthy",
    reviewState: "live"
  },
  {
    id: "design-doc",
    label: "Architecture design doc",
    localUser: "Sam",
    presence: 2,
    pendingOps: 5,
    localCursor: "Trade-offs",
    remoteCursors: ["Reviewer on intro"],
    syncHealth: "lagging",
    reviewState: "comment-heavy"
  },
  {
    id: "recovery-mode",
    label: "Recovery session",
    localUser: "Nina",
    presence: 3,
    pendingOps: 7,
    localCursor: "Rollback notes",
    remoteCursors: ["Editor reconnecting"],
    syncHealth: "diverged",
    reviewState: "repair"
  }
] as const;

export const collaborationPolicies = [
  "Acknowledge optimistic edits explicitly when the server round-trip is visible.",
  "Show remote cursor ownership and stale presence age during active editing.",
  "Collapse conflict repair into a focused recovery lane instead of silently overwriting text.",
  "Gate final publish or resolve actions while local operations are still unacknowledged."
];

export const recoveryActions = [
  { risk: "Operation backlog", action: "Pause publish and summarize which edits are still local-only." },
  { risk: "Diverged revision", action: "Render a merge queue with per-block ownership before reconnecting." },
  { risk: "Stale collaborator", action: "Fade stale cursors and annotate the last heartbeat time." }
];
