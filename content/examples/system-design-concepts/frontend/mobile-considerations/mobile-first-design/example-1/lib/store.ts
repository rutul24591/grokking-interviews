export const mobileSurfaces = [
  {
    id: "reader-home",
    label: "Reader home",
    width: 390,
    thumbReachScore: "high",
    primaryAction: "Continue reading",
    contentOrder: ["hero", "resume", "topics", "newsletter"],
    secondaryRailAllowed: false
  },
  {
    id: "tablet-library",
    label: "Tablet library",
    width: 820,
    thumbReachScore: "medium",
    primaryAction: "Open collection",
    contentOrder: ["search", "collections", "recent", "tips"],
    secondaryRailAllowed: true
  },
  {
    id: "desktop-research",
    label: "Desktop research",
    width: 1280,
    thumbReachScore: "low",
    primaryAction: "Open outline",
    contentOrder: ["search", "outline", "article", "notes"],
    secondaryRailAllowed: true
  }
] as const;

export const mobileFirstPractices = [
  "Start with the narrowest reading path and add secondary context only when space allows.",
  "Keep primary actions in the thumb zone for small screens.",
  "Preserve the same content order as breakpoints expand so navigation stays predictable.",
  "Avoid desktop-only rails that displace the main reading task on phones."
];

export const layoutWarnings = [
  { issue: "Action drift", action: "Move primary CTA into the bottom action cluster on phones." },
  { issue: "Secondary rail overflow", action: "Collapse rail content behind a sheet below tablet width." },
  { issue: "Content order mismatch", action: "Keep the same semantic order and only change visual grouping." }
];
