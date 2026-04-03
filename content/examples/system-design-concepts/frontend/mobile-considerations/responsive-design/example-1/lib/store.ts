export const viewportStates = [
  {
    id: "phone",
    label: "Phone",
    width: 390,
    columns: 1,
    nav: "bottom",
    cardDensity: "comfortable",
    tapTargetSafe: true,
    readingOrderStable: true
  },
  {
    id: "tablet",
    label: "Tablet",
    width: 820,
    columns: 2,
    nav: "rail",
    cardDensity: "balanced",
    tapTargetSafe: true,
    readingOrderStable: true
  },
  {
    id: "desktop",
    label: "Desktop",
    width: 1280,
    columns: 3,
    nav: "rail",
    cardDensity: "dense",
    tapTargetSafe: true,
    readingOrderStable: true
  }
] as const;

export const responsiveHeuristics = [
  "Scale layout density gradually instead of rebuilding interaction patterns per breakpoint.",
  "Preserve reading order and landmark order as columns expand.",
  "Keep tap targets safe on touch-capable tablets, even when density increases.",
  "Treat the phone layout as the baseline semantic order for larger viewports."
];

export const responsiveRisks = [
  { issue: "Dense cards on phones", action: "Relax density and restore one readable card stack." },
  { issue: "Reading order drift", action: "Keep DOM order stable and use CSS only for layout grouping." },
  { issue: "Bottom nav missing", action: "Restore reachable navigation below tablet width." }
];
