export const scenarios = [
  {
    "id": "panel-grid",
    "label": "Adaptive panel grid",
    "surface": "Analytics dashboard",
    "status": "healthy",
    "signal": "8 panels observed with loop guard",
    "budget": "Discrete layout buckets",
    "fallback": "Breakpoint layout remains available",
    "headline": "Container-aware layout can adapt the dashboard safely when the observer only drives discrete layout decisions.",
    "decision": "Keep the observer read-only and map sizes into discrete layout buckets.",
    "tasks": [
      "Use discrete size buckets.",
      "Keep a breakpoint fallback.",
      "Avoid sync write-back inside callbacks."
    ]
  },
  {
    "id": "chart-redraw",
    "label": "Chart redraw path",
    "surface": "Resizable chart panel",
    "status": "watch",
    "signal": "Expensive redraw on width change",
    "budget": "Callback throttled to budget",
    "fallback": "Skeleton shown during redraw",
    "headline": "Resize-triggered chart redraws need throttling and visible degraded states when repaint cost is high.",
    "decision": "Throttle expensive redraws and reduce animation while the chart recomputes.",
    "tasks": [
      "Throttle redraw callbacks.",
      "Reduce animation during chart redraw.",
      "Keep a simple fallback layout ready."
    ]
  },
  {
    "id": "feedback-loop",
    "label": "Feedback loop detected",
    "surface": "Self-resizing component",
    "status": "repair",
    "signal": "Observer writes directly into layout",
    "budget": "Loop guard missing",
    "fallback": "Breakpoint-only layout mode",
    "headline": "A resize observer that writes back into layout synchronously creates a correctness defect and must be shut down.",
    "decision": "Break the write loop and fall back to discrete breakpoint logic until the component is stable.",
    "tasks": [
      "Stop sync write-back.",
      "Enable loop guard telemetry.",
      "Move to simpler breakpoint layout until fixed."
    ]
  }
] as const;

export const playbook = [
  "Do not write layout-affecting values synchronously inside resize callbacks.",
  "Throttle expensive redraws triggered by size changes.",
  "Keep a breakpoint-style fallback when container-driven layout becomes unstable."
] as const;

export const recovery = [
  {
    "issue": "Resize loop",
    "action": "Break the write loop and revert to discrete size buckets."
  },
  {
    "issue": "Expensive redraw",
    "action": "Throttle callback work and reduce animation during redraw."
  },
  {
    "issue": "Unstable container layout",
    "action": "Use the simpler responsive layout until observer jitter is fixed."
  }
] as const;
