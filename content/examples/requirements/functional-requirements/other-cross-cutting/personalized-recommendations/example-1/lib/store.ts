type Item = {
  id: string;
  title: string;
  subtitle: string;
  status: string;
  detail: string;
  flagged: boolean;
};

type Snapshot = {
  title: string;
  summary: string;
  primaryLabel: string;
  secondaryLabel: string;
  primaryValue: string;
  secondaryValue: string;
  primaryActionLabel: string;
  secondaryActionLabel: string;
  advanceActionLabel: string;
  items: Item[];
  notes: string[];
  message: string;
};

type State = {
  primaryIndex: number;
  secondaryIndex: number;
  items: Item[];
  message: string;
};

const primaryValues = ["history signals","ranking blend","fallback feed"];
const secondaryValues = ["personalized","contextual","baseline"];
const statuses = ["ready", "active", "recovering", "blocked"] as const;
const baseItems: Item[] = [
  {
    "id": "recs-1",
    "title": "Signal inventory",
    "subtitle": "Recent clicks and saves present",
    "detail": "The engine has enough first-party behavior to personalize strongly.",
    "status": "active",
    "flagged": false
  },
  {
    "id": "recs-2",
    "title": "Ranking blend",
    "subtitle": "One candidate set missing",
    "detail": "The content-based candidate set failed, so collaborative ranking weight is too high.",
    "status": "recovering",
    "flagged": true
  },
  {
    "id": "recs-3",
    "title": "Fallback feed",
    "subtitle": "Baseline feed ready",
    "detail": "A baseline trending feed remains available if personalization cannot run safely.",
    "status": "ready",
    "flagged": false
  }
];
const summary = "Generate user-specific recommendations, surface why items were chosen, and degrade safely when history or policy signals are missing.";
const notes = ["Recommendation systems should always explain the fallback path.","Cold start and policy suppression are not the same problem.","Ranking blends should be observable enough to catch missing candidate sources."];

let state: State = {
  primaryIndex: 0,
  secondaryIndex: 0,
  items: structuredClone(baseItems),
  message: "Personalized Recommendations workflow ready."
};

export function getSnapshot(): Snapshot {
  return {
    title: "Personalized Recommendations",
    summary,
    primaryLabel: "recommendation view",
    secondaryLabel: "ranking mode",
    primaryValue: primaryValues[state.primaryIndex],
    secondaryValue: secondaryValues[state.secondaryIndex],
    primaryActionLabel: "Advance recommendation view",
    secondaryActionLabel: "Cycle ranking mode",
    advanceActionLabel: "Advance selected item",
    items: state.items.map((item) => ({ ...item })),
    notes,
    message: state.message
  };
}

export function applyAction(action: string, itemId?: string) {
  if (action === "cycle-primary") {
    state.primaryIndex = (state.primaryIndex + 1) % primaryValues.length;
    state.message = "Personalized Recommendations" + " moved to " + primaryValues[state.primaryIndex] + ".";
    return;
  }

  if (action === "cycle-secondary") {
    state.secondaryIndex = (state.secondaryIndex + 1) % secondaryValues.length;
    state.message = "Personalized Recommendations" + " switched to " + secondaryValues[state.secondaryIndex] + ".";
    return;
  }

  if (action === "advance-item" && itemId) {
    state.items = state.items.map((item) => {
      if (item.id !== itemId) return item;
      const nextStatus = statuses[(statuses.indexOf(item.status as (typeof statuses)[number]) + 1) % statuses.length];
      return {
        ...item,
        status: nextStatus,
        flagged: nextStatus === "recovering" || nextStatus === "blocked",
        detail: item.title + " is now in " + nextStatus + " while " + secondaryValues[state.secondaryIndex] + " remains active."
      };
    });
    state.message = "Advanced " + itemId + " in Personalized Recommendations.";
    return;
  }

  if (action === "reset") {
    state.primaryIndex = 0;
    state.secondaryIndex = 0;
    state.items = structuredClone(baseItems);
    state.message = "Personalized Recommendations workflow reset.";
  }
}
