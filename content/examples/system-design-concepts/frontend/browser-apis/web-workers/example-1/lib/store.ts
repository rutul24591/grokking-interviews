export const scenarios = [
  {
    "id": "index-build",
    "label": "Index build",
    "surface": "Client-side search indexing",
    "status": "healthy",
    "signal": "28 MB payload handled off-thread",
    "budget": "Versioned message protocol active",
    "fallback": "UI thread remains responsive",
    "headline": "The worker is appropriate here because indexing would otherwise block the main thread.",
    "decision": "Keep the heavy compute in the worker and pin responses to request versions.",
    "tasks": [
      "Version messages.",
      "Reject stale responses.",
      "Keep fallback behavior documented."
    ]
  },
  {
    "id": "preview-transform",
    "label": "Preview transform",
    "surface": "Markdown preview rendering",
    "status": "watch",
    "signal": "Queue depth 3 under active editing",
    "budget": "Stale result guard required",
    "fallback": "Server render fallback ready",
    "headline": "The preview worker is safe only if stale outputs never repaint newer editor state.",
    "decision": "Pin every request to a version and drop any response that arrives late.",
    "tasks": [
      "Version every request.",
      "Drop obsolete responses.",
      "Keep server-side fallback visible."
    ]
  },
  {
    "id": "protocol-drift",
    "label": "Worker protocol drift",
    "surface": "UI and worker version mismatch",
    "status": "repair",
    "signal": "Message schema mismatch detected",
    "budget": "Fallback path currently blocked",
    "fallback": "Degraded local behavior required",
    "headline": "Protocol drift is a release blocker because stale or incompatible responses can corrupt state.",
    "decision": "Gate the worker by protocol version and move to a degraded fallback until versions match.",
    "tasks": [
      "Block incompatible messages.",
      "Enable degraded fallback.",
      "Make protocol drift visible in diagnostics."
    ]
  }
] as const;

export const playbook = [
  "Reserve workers for CPU-heavy or latency-sensitive work.",
  "Version the message protocol and reject stale responses.",
  "Keep a degraded fallback when the worker path breaks."
] as const;

export const recovery = [
  {
    "issue": "Protocol drift",
    "action": "Reject incompatible messages and fallback safely."
  },
  {
    "issue": "Stale worker output",
    "action": "Pin request ids and drop obsolete responses."
  },
  {
    "issue": "Worker unavailable",
    "action": "Move to server or simplified local behavior."
  }
] as const;
