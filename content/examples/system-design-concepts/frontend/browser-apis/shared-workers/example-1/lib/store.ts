export const scenarios = [
  {
    "id": "healthy-bus",
    "label": "Healthy shared bus",
    "surface": "Cross-tab analytics drain",
    "status": "healthy",
    "signal": "4 connected ports with bounded queue",
    "budget": "Single network drain per browser",
    "fallback": "Dedicated-worker fallback documented",
    "headline": "A shared worker is useful here because it centralizes duplicate background work across tabs.",
    "decision": "Keep one shared queue and bound work as tabs connect and disconnect.",
    "tasks": [
      "Prune idle ports.",
      "Keep the queue bounded.",
      "Document the dedicated-worker fallback."
    ]
  },
  {
    "id": "tab-churn",
    "label": "Tab churn under load",
    "surface": "Many short-lived tabs",
    "status": "watch",
    "signal": "Queue depth climbing to 18 items",
    "budget": "Idle ports should disconnect quickly",
    "fallback": "Drop duplicate queued work",
    "headline": "Rapid tab churn will overfill the shared queue unless idle ports are pruned and duplicate work is collapsed.",
    "decision": "Disconnect idle ports aggressively and collapse duplicate work items.",
    "tasks": [
      "Prune idle ports faster.",
      "Deduplicate queued work.",
      "Keep queue depth visible in diagnostics."
    ]
  },
  {
    "id": "unsupported-runtime",
    "label": "Unsupported runtime",
    "surface": "Browser without Shared Worker support",
    "status": "repair",
    "signal": "Shared Worker capability missing",
    "budget": "Dedicated-worker fallback required",
    "fallback": "Tab-local mode remains available",
    "headline": "Unsupported browsers must degrade to dedicated workers or tab-local behavior without breaking the feature.",
    "decision": "Switch immediately to the documented fallback and stop assuming cross-tab consolidation.",
    "tasks": [
      "Enable the dedicated-worker fallback.",
      "Explain reduced efficiency in diagnostics.",
      "Avoid silent shared-state assumptions."
    ]
  }
] as const;

export const playbook = [
  "Use Shared Workers for de-duplication and coordination, not sole authority.",
  "Keep queues bounded and prune idle ports.",
  "Document a dedicated-worker or tab-local fallback for unsupported browsers."
] as const;

export const recovery = [
  {
    "issue": "Queue bloat",
    "action": "Prune idle ports and collapse duplicate tasks."
  },
  {
    "issue": "Unsupported runtime",
    "action": "Fallback to dedicated workers or tab-local behavior."
  },
  {
    "issue": "Shared state drift",
    "action": "Rehydrate from a canonical snapshot before accepting writes."
  }
] as const;
