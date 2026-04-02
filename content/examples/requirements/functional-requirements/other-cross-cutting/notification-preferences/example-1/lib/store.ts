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

const primaryValues = ["channel setup","category routing","effective preview"];
const secondaryValues = ["push first","email fallback","inbox only"];
const statuses = ["ready", "active", "recovering", "blocked"] as const;
const baseItems: Item[] = [
  {
    "id": "np-1",
    "title": "Channel setup",
    "subtitle": "Push and email both enabled",
    "detail": "The user wants critical notifications on push and digest summaries in email.",
    "status": "active",
    "flagged": false
  },
  {
    "id": "np-2",
    "title": "Conflict checker",
    "subtitle": "One category points nowhere",
    "detail": "A category lost every delivery channel after recent setting edits.",
    "status": "recovering",
    "flagged": true
  },
  {
    "id": "np-3",
    "title": "Preview panel",
    "subtitle": "Effective behavior visible",
    "detail": "The user can preview which channel each notification category will use.",
    "status": "ready",
    "flagged": false
  }
];
const summary = "Manage channel and category preferences, preview effective delivery behavior, and detect conflicting settings before save.";
const notes = ["Preference editors should show effective routing, not just raw toggles.","Categories with no remaining channel need explicit warning.","Fallback rules need to be deterministic when the preferred channel is unavailable."];

let state: State = {
  primaryIndex: 0,
  secondaryIndex: 0,
  items: structuredClone(baseItems),
  message: "Notification Preferences workflow ready."
};

export function getSnapshot(): Snapshot {
  return {
    title: "Notification Preferences",
    summary,
    primaryLabel: "preference view",
    secondaryLabel: "delivery posture",
    primaryValue: primaryValues[state.primaryIndex],
    secondaryValue: secondaryValues[state.secondaryIndex],
    primaryActionLabel: "Advance preference view",
    secondaryActionLabel: "Cycle delivery posture",
    advanceActionLabel: "Advance selected item",
    items: state.items.map((item) => ({ ...item })),
    notes,
    message: state.message
  };
}

export function applyAction(action: string, itemId?: string) {
  if (action === "cycle-primary") {
    state.primaryIndex = (state.primaryIndex + 1) % primaryValues.length;
    state.message = "Notification Preferences" + " moved to " + primaryValues[state.primaryIndex] + ".";
    return;
  }

  if (action === "cycle-secondary") {
    state.secondaryIndex = (state.secondaryIndex + 1) % secondaryValues.length;
    state.message = "Notification Preferences" + " switched to " + secondaryValues[state.secondaryIndex] + ".";
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
    state.message = "Advanced " + itemId + " in Notification Preferences.";
    return;
  }

  if (action === "reset") {
    state.primaryIndex = 0;
    state.secondaryIndex = 0;
    state.items = structuredClone(baseItems);
    state.message = "Notification Preferences workflow reset.";
  }
}
