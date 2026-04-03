export const orientationSessions = [
  {
    id: "video-landscape",
    label: "Landscape video viewer",
    permission: "granted",
    orientation: "landscape",
    tilt: 22,
    activePane: "media",
    fallbackReady: true,
    lastRotationMs: 3200
  },
  {
    id: "reading-portrait",
    label: "Portrait reading session",
    permission: "prompt",
    orientation: "portrait",
    tilt: 4,
    activePane: "article",
    fallbackReady: true,
    lastRotationMs: 800
  },
  {
    id: "locked-device",
    label: "Sensor denied device",
    permission: "denied",
    orientation: "portrait",
    tilt: 0,
    activePane: "article",
    fallbackReady: false,
    lastRotationMs: 0
  }
] as const;

export const orientationPolicies = [
  "Request orientation permissions only after a user-triggered feature request.",
  "Always keep a portrait-safe and landscape-safe fallback composition.",
  "Throttle layout recomputation during rapid rotations to avoid jank.",
  "Treat denied or unavailable sensors as a first-class supported path."
];

export const orientationRecovery = [
  { risk: "Permission denied", action: "Hide sensor-only UI and persist a static layout preference." },
  { risk: "Rapid rotation", action: "Debounce layout swaps and keep media controls anchored." },
  { risk: "Fallback missing", action: "Render a stable portrait layout with explicit rotate guidance." }
];
