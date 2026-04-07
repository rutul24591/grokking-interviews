export const scenarios = [
  {
    "id": "confirm-pulse",
    "label": "Short confirmation pulse",
    "surface": "Payment confirmation",
    "status": "healthy",
    "signal": "Short success pulse with opt-in",
    "budget": "Visible toast mirror remains primary",
    "fallback": "Audio or visual cue always available",
    "headline": "Short confirmation haptics are fine as long as the primary confirmation remains visible.",
    "decision": "Keep haptics as enhancement and mirror them with visual confirmation.",
    "tasks": [
      "Mirror the cue visually.",
      "Keep patterns short.",
      "Respect explicit opt-out preferences."
    ]
  },
  {
    "id": "urgent-warning",
    "label": "Urgent warning cue",
    "surface": "Safety-critical alert",
    "status": "watch",
    "signal": "Urgent pulse pattern requested",
    "budget": "Urgent lane only",
    "fallback": "Audio and toast backup visible",
    "headline": "Longer or stronger patterns need to stay inside the urgent lane and respect sensory preferences.",
    "decision": "Constrain stronger haptics to urgent flows and keep reduced-motion preferences authoritative.",
    "tasks": [
      "Reserve strong patterns for urgent cues.",
      "Honor reduced-motion.",
      "Keep a non-haptic backup visible."
    ]
  },
  {
    "id": "unsupported-haptics",
    "label": "Unsupported device",
    "surface": "No vibration support",
    "status": "repair",
    "signal": "Vibration capability missing",
    "budget": "Visual-only fallback",
    "fallback": "No haptic assumptions in copy",
    "headline": "Unsupported devices still need equivalent feedback without assuming vibration support.",
    "decision": "Fallback to visual or audio cues and stop describing the interaction as haptic.",
    "tasks": [
      "Hide haptic-specific copy.",
      "Keep visual confirmation visible.",
      "Respect reduced-motion even in fallback mode."
    ]
  }
] as const;

export const playbook = [
  "Treat haptics as enhancement, never the only confirmation channel.",
  "Respect reduced-motion and explicit haptic opt-out settings.",
  "Reserve stronger patterns for urgent cues only."
] as const;

export const recovery = [
  {
    "issue": "Unsupported device",
    "action": "Mirror the cue visually or audibly and continue the flow."
  },
  {
    "issue": "Noisy haptics",
    "action": "Restrict patterns to urgent lanes and shorten durations."
  },
  {
    "issue": "Accessibility conflict",
    "action": "Disable haptics when user preferences require it."
  }
] as const;
