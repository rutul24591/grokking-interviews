export const releases = [
  {
    id: "api-shell",
    label: "App shell release",
    state: "healthy",
    readiness: "Pods pass readiness before traffic shift",
    draining: "Connection draining is 45 seconds",
    note: "Static assets and HTML stay backward-compatible during the swap",
    actions: [
      "Shift traffic only after readiness and asset availability are both green.",
      "Keep draining long enough for active sessions to finish.",
      "Version assets so old HTML never points to removed files."
    ]
  },
  {
    id: "feed-release",
    label: "Live feed release",
    state: "watch",
    readiness: "Pods become ready before websocket subscriptions are hydrated",
    draining: "Connection draining is 15 seconds",
    note: "Traffic moves before long-lived connections are safely handed over",
    actions: [
      "Delay readiness until subscriptions are warmed.",
      "Extend draining for long-lived sessions.",
      "Replay missed events when connections move."
    ]
  },
  {
    id: "checkout-release",
    label: "Checkout release",
    state: "repair",
    readiness: "Pods are ready but schema compatibility is broken",
    draining: "Traffic cannot stay on the new release",
    note: "The deployment appears alive but cannot serve real customer paths safely",
    actions: [
      "Return traffic to the previous version immediately.",
      "Restore API and schema compatibility before retrying.",
      "Treat synthetic checks and real checkout flows separately."
    ]
  }
] as const;

export const zeroDowntimeRules = [
  "Readiness must represent customer readiness, not just process boot.",
  "Connection draining and asset compatibility are part of zero-downtime strategy.",
  "A release that is technically up but breaks user flows is not zero downtime."
] as const;
