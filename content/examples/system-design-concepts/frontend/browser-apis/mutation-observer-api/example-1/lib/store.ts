export const scenarios = [
  {
    "id": "editor-subtree",
    "label": "Scoped editor assist",
    "surface": "Rich editor helper lane",
    "status": "healthy",
    "signal": "Single editor subtree observed",
    "budget": "4 mutations per second",
    "fallback": "Observer disconnects on unmount",
    "headline": "A narrow editor subtree is a good fit for mutation observation as long as it disconnects cleanly.",
    "decision": "Keep the observer tightly scoped and derive UI changes in a coalesced pass.",
    "tasks": [
      "Observe only the editor subtree.",
      "Coalesce mutation bursts.",
      "Disconnect on unmount and navigation."
    ]
  },
  {
    "id": "widget-churn",
    "label": "Third-party widget churn",
    "surface": "Embedded vendor widget",
    "status": "watch",
    "signal": "17 mutations per second from untrusted widget",
    "budget": "Throttle downstream UI updates",
    "fallback": "Pause non-critical derived renders",
    "headline": "Third-party widget churn can dominate mutation traffic and should not cascade directly into product UI.",
    "decision": "Throttle mutation-derived work and sandbox the widget subtree.",
    "tasks": [
      "Throttle downstream updates.",
      "Suspend non-critical mutations.",
      "Keep widget sandbox boundaries explicit."
    ]
  },
  {
    "id": "global-leak",
    "label": "Leaky global observer",
    "surface": "Document-wide observation",
    "status": "repair",
    "signal": "47 mutations per second on document root",
    "budget": "Memory growth visible",
    "fallback": "Re-scope before shipping",
    "headline": "A global observer that never disconnects becomes both a performance and correctness defect.",
    "decision": "Disconnect immediately and reduce the observed scope to the minimal subtree.",
    "tasks": [
      "Disconnect on route change.",
      "Drop document-level observation.",
      "Reset queued mutation work after cleanup."
    ]
  }
] as const;

export const playbook = [
  "Observe the smallest subtree possible.",
  "Coalesce mutation bursts before deriving UI state.",
  "Disconnect observers reliably on unmount or navigation."
] as const;

export const recovery = [
  {
    "issue": "Scope too broad",
    "action": "Reduce observation to the minimal relevant subtree."
  },
  {
    "issue": "Widget churn",
    "action": "Throttle mutation-driven work and sandbox the source widget."
  },
  {
    "issue": "Leaky observer",
    "action": "Disconnect immediately and clear queued mutation work."
  }
] as const;
