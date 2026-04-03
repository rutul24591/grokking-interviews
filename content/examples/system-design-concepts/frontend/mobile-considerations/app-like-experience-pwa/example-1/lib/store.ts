export const installMoments = [
  {
    id: "reader-returning",
    label: "Returning reader",
    engagement: "Completed 4 articles and saved 2 drafts",
    installEligible: true,
    shellStatus: "healthy",
    offlineQueueDepth: 1,
    pushEligible: true,
    resumeActions: ["Resume saved draft", "Open offline library", "Check alerts"]
  },
  {
    id: "first-visit",
    label: "First visit",
    engagement: "Only landed on one article from search",
    installEligible: false,
    shellStatus: "warming",
    offlineQueueDepth: 0,
    pushEligible: false,
    resumeActions: ["Read top article", "Browse topics"]
  },
  {
    id: "offline-heavy",
    label: "Offline commuter",
    engagement: "Downloads reading packs and revisits every morning",
    installEligible: true,
    shellStatus: "degraded",
    offlineQueueDepth: 5,
    pushEligible: false,
    resumeActions: ["Retry queued saves", "Refresh downloaded pack", "Open bookmarks"]
  }
] as const;

export const pwaPolicies = [
  "Delay the install prompt until users finish a meaningful task or revisit intentionally.",
  "Keep the shell and top reading routes cached before advertising offline support.",
  "Surface queued offline actions with explicit recovery once the device reconnects.",
  "Treat push re-engagement as a post-install workflow, not a first-session prompt."
];

export const recoveryPlaybook = [
  { issue: "Shell degraded", action: "Fall back to the minimal offline reading shell and suppress install promotion." },
  { issue: "Queue backlog growing", action: "Show a sync tray with retry counts and stale draft warnings." },
  { issue: "Push unavailable", action: "Promote in-app revisit reminders instead of browser push." }
];
