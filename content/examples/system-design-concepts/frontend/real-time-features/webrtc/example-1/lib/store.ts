export const peerSessions = [
  {
    id: "healthy-call",
    label: "Healthy peer call",
    signalingState: "stable",
    iceState: "connected",
    mediaState: "flowing",
    localDevice: "camera+mic",
    remoteDevice: "camera+mic",
    renegotiationPending: false
  },
  {
    id: "lagging-call",
    label: "Lagging peer call",
    signalingState: "have-local-offer",
    iceState: "checking",
    mediaState: "audio-only",
    localDevice: "camera+mic",
    remoteDevice: "mic-only",
    renegotiationPending: true
  },
  {
    id: "repair-call",
    label: "Repairing call",
    signalingState: "unstable",
    iceState: "failed",
    mediaState: "muted",
    localDevice: "mic-only",
    remoteDevice: "unknown",
    renegotiationPending: true
  }
] as const;

export const webrtcPolicies = [
  "Keep signaling, ICE, and media states visible separately so failures are diagnosable.",
  "Treat renegotiation as a first-class user-visible state during device changes.",
  "Offer a lower-fidelity fallback when video cannot recover quickly.",
  "Surface device loss distinctly from peer disconnects."
];

export const webrtcRecovery = [
  { issue: "ICE failed", action: "Retry candidate gathering, fall back to audio-only, and expose reconnect controls." },
  { issue: "Renegotiation pending", action: "Freeze non-critical device changes until the offer/answer cycle stabilizes." },
  { issue: "Remote device unknown", action: "Show degraded peer status and keep the call in reconnection mode." }
];
