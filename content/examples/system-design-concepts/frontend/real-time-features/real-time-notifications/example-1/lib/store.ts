export const notificationSessions = [
  {
    id: "ops-notify",
    label: "Operations alerts",
    channelMix: ["push", "in-app"],
    unreadCount: 5,
    urgentCount: 2,
    deliveryState: "healthy",
    dedupeWindowMinutes: 5,
    muted: false
  },
  {
    id: "social-notify",
    label: "Social activity",
    channelMix: ["in-app"],
    unreadCount: 12,
    urgentCount: 0,
    deliveryState: "lagging",
    dedupeWindowMinutes: 15,
    muted: false
  },
  {
    id: "muted-thread",
    label: "Muted thread",
    channelMix: ["push", "in-app"],
    unreadCount: 3,
    urgentCount: 1,
    deliveryState: "repair",
    dedupeWindowMinutes: 15,
    muted: true
  }
] as const;

export const notificationPolicies = [
  "Separate urgent and routine notifications so bursty activity does not bury incidents.",
  "Deduplicate notifications across push and in-app channels within a defensible window.",
  "Respect mute state before evaluating push eligibility.",
  "Show inbox freshness and fallback to inbox-first delivery when push health degrades."
];

export const notificationRecovery = [
  { issue: "Push degraded", action: "Move urgent items into an elevated in-app tray and show channel health." },
  { issue: "Duplicate fanout", action: "Collapse repeated events behind one summary card with a counter." },
  { issue: "Muted thread leak", action: "Suppress push and collapse routine inbox entries automatically." }
];
