export const cutovers = [
  {
    id: "catalog-web",
    label: "Catalog web cutover",
    blueVersion: "2026.04.02-1",
    greenVersion: "2026.04.03-4",
    routeWeight: "25% green / 75% blue",
    parity: "Asset manifest, env vars, and CDN rules match",
    risk: "healthy",
    customerSignal: "No regression on navigation latency or cart conversion",
    rollbackSlo: "Rollback in under 45 seconds",
    tasks: [
      "Run parity diff between blue and green asset manifests.",
      "Drain old websocket sessions before increasing weight.",
      "Keep blue write-disabled but fully warm for instant reversal."
    ],
    checkpoints: [
      "Synthetic smoke checks green routes every 30 seconds.",
      "Business KPI panel watches conversion and search CTR.",
      "Operator keeps blue target group in ready state."
    ]
  },
  {
    id: "search-ui",
    label: "Search experience cutover",
    blueVersion: "2026.04.01-7",
    greenVersion: "2026.04.03-2",
    routeWeight: "5% green / 95% blue",
    parity: "Green misses one locale-specific search env var",
    risk: "watch",
    customerSignal: "Autocomplete errors isolated to one traffic slice",
    rollbackSlo: "Hold promotion until parity restored",
    tasks: [
      "Patch locale env drift and rebuild the green image.",
      "Re-run smoke and shadow traffic against autocomplete.",
      "Keep the traffic weight pinned at 5% until errors clear."
    ],
    checkpoints: [
      "Diff environment variables by namespace before promotion.",
      "Pin rollout on search-specific error budget, not generic 500 rate.",
      "Confirm blue still serves the entire fallback cohort."
    ]
  },
  {
    id: "checkout-ui",
    label: "Checkout cutover",
    blueVersion: "2026.03.31-9",
    greenVersion: "2026.04.03-5",
    routeWeight: "60% green / 40% blue",
    parity: "Parity was clean before promotion",
    risk: "repair",
    customerSignal: "Payment iframe failures spike after cookie domain change",
    rollbackSlo: "Immediate reversal required",
    tasks: [
      "Move all checkout traffic back to blue immediately.",
      "Invalidate the green cookie config and freeze more promotions.",
      "Capture cutover diff, payment errors, and impacted session counts."
    ],
    checkpoints: [
      "Treat payment conversion loss as a hard rollback signal.",
      "Do not attempt live patching while green still serves users.",
      "Keep rollback operator action visible in the release console."
    ]
  }
] as const;

export const recoveryLanes = [
  {
    trigger: "Parity drift",
    action: "Freeze traffic weight and restore config parity before any promotion."
  },
  {
    trigger: "Business KPI regression",
    action: "Route all customer traffic back to blue and keep green for debugging only."
  },
  {
    trigger: "Session stickiness mismatch",
    action: "Drain current sessions, clear stickiness rules, and restart the rollout."
  }
] as const;
