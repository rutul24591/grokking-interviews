export const deviceProfiles = [
  {
    id: "entry-android",
    label: "Entry Android",
    cpuBudget: "critical",
    memoryMb: 256,
    hydrationMode: "minimal-islands",
    animationBudget: "minimal",
    longTaskMs: 260
  },
  {
    id: "mid-android",
    label: "Mid-range Android",
    cpuBudget: "tight",
    memoryMb: 512,
    hydrationMode: "split-sections",
    animationBudget: "reduced",
    longTaskMs: 130
  },
  {
    id: "high-ios",
    label: "High-end iPhone",
    cpuBudget: "comfortable",
    memoryMb: 1024,
    hydrationMode: "full-interactive",
    animationBudget: "full",
    longTaskMs: 40
  }
] as const;

export const performancePlaybook = [
  "Trim hydrated surface area before cutting only visual polish.",
  "Gate heavy charts and advanced search panels behind explicit user intent on weak devices.",
  "Reduce simultaneous animations when long tasks or input delay rise.",
  "Keep a low-cost fallback surface for devices with tight CPU and memory budgets."
];

export const budgetAlerts = [
  { issue: "Long tasks rising", action: "Suspend non-critical hydration and defer analytics enrichments." },
  { issue: "Memory pressure", action: "Collapse background widgets and unload large chart modules." },
  { issue: "Animation overload", action: "Apply reduced-motion defaults and remove parallel transitions." }
];
