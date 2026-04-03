export const sseChannels = [
  {
    id: "metrics-stream",
    label: "Metrics stream",
    eventType: "metrics",
    retryMs: 3000,
    lastEventId: "m-1024",
    streamHealth: "healthy",
    replayGap: 0,
    bufferedEvents: 1
  },
  {
    id: "release-stream",
    label: "Release feed",
    eventType: "release",
    retryMs: 5000,
    lastEventId: "r-220",
    streamHealth: "lagging",
    replayGap: 3,
    bufferedEvents: 4
  },
  {
    id: "recovering-stream",
    label: "Recovering SSE",
    eventType: "alerts",
    retryMs: 8000,
    lastEventId: "a-88",
    streamHealth: "repair",
    replayGap: 6,
    bufferedEvents: 7
  }
] as const;

export const ssePolicies = [
  "Keep the last event id visible and use it for replay after reconnect.",
  "Differentiate healthy streaming from reconnecting and replaying states.",
  "Buffer bursts briefly so the UI can apply grouped state changes.",
  "Show one-way transport limitations explicitly when users expect bidirectional behavior."
];

export const sseRecovery = [
  { issue: "Replay gap", action: "Reconnect with the last event id and fetch missed events before resuming live mode." },
  { issue: "Retry too aggressive", action: "Back off reconnect cadence to avoid retry storms." },
  { issue: "Buffered burst", action: "Apply batched UI updates and label the stream as catching up." }
];
