export const socketSessions = [
  {
    id: "healthy-socket",
    label: "Healthy socket",
    room: "incident-bridge",
    connectionState: "open",
    subscriptionCount: 3,
    outboundQueue: 0,
    heartbeatLagMs: 120,
    reconnectMode: "idle"
  },
  {
    id: "buffering-socket",
    label: "Buffering socket",
    room: "release-room",
    connectionState: "reconnecting",
    subscriptionCount: 2,
    outboundQueue: 5,
    heartbeatLagMs: 900,
    reconnectMode: "backoff"
  },
  {
    id: "degraded-socket",
    label: "Degraded socket",
    room: "presence-room",
    connectionState: "closed",
    subscriptionCount: 4,
    outboundQueue: 8,
    heartbeatLagMs: 2400,
    reconnectMode: "repair"
  }
] as const;

export const websocketPolicies = [
  "Show connection state, reconnect mode, and queue depth separately.",
  "Do not drop user-originated outbound actions silently while reconnecting.",
  "Restore subscriptions deterministically after reconnect before flushing queued actions.",
  "Expose heartbeat lag before the socket fully closes so the UI can degrade early."
];

export const websocketRecovery = [
  { issue: "Reconnect backlog", action: "Pause flush, restore subscriptions, then replay outbound actions in order." },
  { issue: "Heartbeat lag", action: "Show degraded transport state before a hard disconnect occurs." },
  { issue: "Closed socket", action: "Surface manual reconnect and preserve queue state until recovery succeeds." }
];
