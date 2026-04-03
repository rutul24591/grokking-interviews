export const inputScenarios = [
  {
    id: "pointer-unified",
    label: "Pointer-capable tablet",
    inputModel: "pointer",
    hoverSupport: true,
    passiveHandlers: true,
    duplicateClickRisk: false,
    customGesture: "drag-to-sort"
  },
  {
    id: "touch-only",
    label: "Touch-only phone",
    inputModel: "touch",
    hoverSupport: false,
    passiveHandlers: true,
    duplicateClickRisk: false,
    customGesture: "pull-to-refresh"
  },
  {
    id: "legacy-touch",
    label: "Legacy touch implementation",
    inputModel: "touch",
    hoverSupport: false,
    passiveHandlers: false,
    duplicateClickRisk: true,
    customGesture: "carousel-swipe"
  }
] as const;

export const inputPolicies = [
  "Prefer pointer events where a unified model is available.",
  "Keep touch handlers passive unless scroll blocking is intentional and isolated.",
  "Separate hover enhancements from tap-critical interactions.",
  "Guard against duplicate click synthesis when legacy touch handlers coexist with click listeners."
];

export const inputRecovery = [
  { issue: "Duplicate click synthesis", action: "Deduplicate click/touch flows and move to pointer events where possible." },
  { issue: "Scroll blocked", action: "Restore passive handlers and isolate gesture regions from primary scroll containers." },
  { issue: "Hover dependency on touch", action: "Replace hover-only affordances with explicit tap states." }
];
