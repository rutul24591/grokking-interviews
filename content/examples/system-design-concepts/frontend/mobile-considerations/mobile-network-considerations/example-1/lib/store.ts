export const networkSessions = [
  {
    id: "fast-4g",
    label: "Fast 4G commuter",
    latencyMs: 90,
    downlinkMbps: 10,
    saveData: false,
    pendingRequests: 3,
    mediaPolicy: "adaptive-hd",
    pollingMode: "normal"
  },
  {
    id: "spotty-3g",
    label: "Spotty 3G",
    latencyMs: 260,
    downlinkMbps: 1.8,
    saveData: false,
    pendingRequests: 5,
    mediaPolicy: "summary-only",
    pollingMode: "slow"
  },
  {
    id: "save-data-2g",
    label: "Save-Data 2G",
    latencyMs: 520,
    downlinkMbps: 0.4,
    saveData: true,
    pendingRequests: 6,
    mediaPolicy: "text-first",
    pollingMode: "manual"
  }
] as const;

export const networkPractices = [
  "Respect Save-Data before enabling autoplay, prefetch, or progressive media upgrades.",
  "Batch small API calls when latency dominates request time.",
  "Switch to summaries and defer non-critical images on constrained mobile networks.",
  "Expose stale or queued states explicitly so users understand degraded behavior."
];

export const networkRecovery = [
  { issue: "Prefetch overload", action: "Trim candidates to the next likely route and disable media warmup." },
  { issue: "Polling saturation", action: "Move to manual refresh or back off polling aggressively." },
  { issue: "Save-Data conflict", action: "Disable autoplay and force text-first payloads until the signal improves." }
];
