export const stateDefaults = {
  workspaceName: "Platform Core",
  incidentChannel: "#ops-platform",
  enableAutoApprove: false,
  runbookVersion: "v5",
  reviewers: ["platform-lead", "sre-oncall"],
  escalationPolicy: "tier-1",
  draftVersion: "draft-12"
};

export const stateRisks = [
  "Partial saves must not leave derived summaries stale.",
  "Discard should reset edited fields and the readiness summary together.",
  "Read-only sections should not be marked dirty by derived view state.",
  "Derived reviewer coverage must be recomputed after every partial save."
];

export const statePanels = [
  "Workspace identity",
  "Approval and escalation controls",
  "Partial save checkpoints",
  "Discard and rollback safety"
];
