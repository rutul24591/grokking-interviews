export const canaries = [
  {
    id: "pricing-experiment",
    label: "Pricing page release",
    cohort: "5% of logged-in web users",
    risk: "healthy",
    guardrail: "Revenue-per-session and CLS remain stable",
    expansion: "Eligible for 20% after 45 minutes",
    notes: [
      "Segment by region and device class before expansion.",
      "Hold a stable control slice for comparison.",
      "Keep kill switch latency under 30 seconds."
    ]
  },
  {
    id: "mobile-nav",
    label: "Mobile navigation rollout",
    cohort: "10% of iOS Safari users",
    risk: "watch",
    guardrail: "Crash-free sessions degraded for one cohort only",
    expansion: "Stay at 10% until iOS crash regression is fixed",
    notes: [
      "Split canary metrics by browser family.",
      "Exclude the unstable cohort instead of expanding blindly.",
      "Require session replay samples before the next decision."
    ]
  },
  {
    id: "checkout-redesign",
    label: "Checkout redesign rollout",
    cohort: "15% of global traffic",
    risk: "repair",
    guardrail: "Conversion loss and latency regression cross the stop threshold",
    expansion: "Abort expansion and revert to 0%",
    notes: [
      "Treat conversion loss as a hard stop, not a watch signal.",
      "Disable automated expansion until rollback completes.",
      "Attach cohort-specific telemetry to the incident record."
    ]
  }
] as const;

export const recoveryLanes = [
  { issue: "Cohort is not representative", action: "Re-sample the rollout lane before trusting canary data." },
  { issue: "Only one segment regresses", action: "Carve that segment out and keep the rest pinned." },
  { issue: "Global regression", action: "Return exposure to zero and lock further rollout automation." }
] as const;
