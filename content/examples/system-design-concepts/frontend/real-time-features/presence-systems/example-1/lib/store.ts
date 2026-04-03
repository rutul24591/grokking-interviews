export const presenceRooms = [
  {
    id: "triage-room",
    label: "Triage room",
    activeUsers: 6,
    idleUsers: 2,
    staleUsers: 1,
    heartbeatSeconds: 15,
    awayThresholdMinutes: 5,
    syncState: "healthy"
  },
  {
    id: "review-room",
    label: "Review room",
    activeUsers: 3,
    idleUsers: 4,
    staleUsers: 2,
    heartbeatSeconds: 25,
    awayThresholdMinutes: 3,
    syncState: "lagging"
  },
  {
    id: "recovering-room",
    label: "Recovering room",
    activeUsers: 2,
    idleUsers: 1,
    staleUsers: 5,
    heartbeatSeconds: 40,
    awayThresholdMinutes: 3,
    syncState: "repair"
  }
] as const;

export const presencePolicies = [
  "Separate active, idle, and stale states instead of a binary online/offline badge.",
  "Fade stale users and annotate last seen time before removing them from the roster.",
  "Treat heartbeat lag as a degraded system state, not only a user state change.",
  "Avoid presence flicker by debouncing transient disconnects."
];

export const presenceRecovery = [
  { issue: "Stale ghost users", action: "Mark them stale, hide live affordances, and clean them up after the grace window." },
  { issue: "Heartbeat lag", action: "Show degraded presence state and slow refresh animations." },
  { issue: "Away threshold too aggressive", action: "Stretch the idle window before moving active users to away." }
];
