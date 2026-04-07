export const scenarios = [
  {
    "id": "hero-sequence",
    "label": "Hero sequence",
    "surface": "Landing page transition",
    "status": "healthy",
    "signal": "420ms transform timeline with handles retained",
    "budget": "Cancel on route change",
    "fallback": "Reduced-motion CSS transition ready",
    "headline": "The hero timeline is acceptable because handles are retained for pause, cancel, and reduced-motion fallback.",
    "decision": "Keep the current timeline but maintain explicit cancellation and reduced-motion support.",
    "tasks": [
      "Retain handles for cancellation.",
      "Pause off-screen work.",
      "Keep the reduced-motion fallback equivalent."
    ]
  },
  {
    "id": "notification-stack",
    "label": "Notification stack queue",
    "surface": "Queued entrance animations",
    "status": "watch",
    "signal": "6-item staggered queue near budget edge",
    "budget": "Off-screen pause enabled",
    "fallback": "Simple transition mode ready",
    "headline": "Queued animations are close to budget and need visible clamping and off-screen pausing.",
    "decision": "Clamp queue length and pause hidden items before they contribute to jank.",
    "tasks": [
      "Pause hidden timelines.",
      "Clamp queue length.",
      "Reduce duration or motion under load."
    ]
  },
  {
    "id": "runaway-timeline",
    "label": "Runaway timeline",
    "surface": "Orphaned animation handles",
    "status": "repair",
    "signal": "Handles not canceled on unmount",
    "budget": "Main-thread paint spikes visible",
    "fallback": "Simple transition fallback required",
    "headline": "A runaway timeline with leaked handles becomes both a performance and correctness defect.",
    "decision": "Cancel leaked handles and revert to a simpler transition model until control is restored.",
    "tasks": [
      "Cancel on unmount.",
      "Track handle ownership.",
      "Fallback to simpler transitions until fixed."
    ]
  }
] as const;

export const playbook = [
  "Always retain handles for pause, cancel, or reversal.",
  "Pause or skip off-screen animation work.",
  "Keep a reduced-motion or simple-transition fallback ready."
] as const;

export const recovery = [
  {
    "issue": "Runaway timeline",
    "action": "Cancel leaked handles and downgrade to simpler transitions."
  },
  {
    "issue": "Queue overload",
    "action": "Clamp queue length and pause off-screen items."
  },
  {
    "issue": "Budget overrun",
    "action": "Reduce duration and limit work to transform or opacity only."
  }
] as const;
