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

const primaryValues = ["profile visibility","processing permissions","cross-device sync"];
const secondaryValues = ["private by default","balanced exposure","public with overrides"];
const statuses = ["ready", "active", "recovering", "blocked"] as const;
const baseItems: Item[] = [
  {
    "id": "priv-1",
    "title": "Visibility rule",
    "subtitle": "Profile fields scoped by setting",
    "detail": "The current privacy tier controls profile cards, follower discovery, and content previews.",
    "status": "active",
    "flagged": false
  },
  {
    "id": "priv-2",
    "title": "Processing rule",
    "subtitle": "Sensitive processing still enabled",
    "detail": "A downstream system has not yet applied the stricter privacy policy chosen by the user.",
    "status": "recovering",
    "flagged": true
  },
  {
    "id": "priv-3",
    "title": "Device sync",
    "subtitle": "One device still stale",
    "detail": "A stale mobile session continues to show old privacy affordances until sync completes.",
    "status": "ready",
    "flagged": false
  }
];
const summary = "Expose user privacy controls, preview how they affect visibility and processing, and keep effective policy state synchronized across devices.";
const notes = ["Privacy settings need an explanation of effective behavior, not just toggle labels.","Profile visibility and backend processing permissions are related but not identical.","Cross-device consistency matters because privacy bugs are user-visible almost immediately."];

let state: State = {
  primaryIndex: 0,
  secondaryIndex: 0,
  items: structuredClone(baseItems),
  message: "Privacy Settings workflow ready."
};

export function getSnapshot(): Snapshot {
  return {
    title: "Privacy Settings",
    summary,
    primaryLabel: "privacy view",
    secondaryLabel: "enforcement level",
    primaryValue: primaryValues[state.primaryIndex],
    secondaryValue: secondaryValues[state.secondaryIndex],
    primaryActionLabel: "Advance privacy view",
    secondaryActionLabel: "Cycle enforcement level",
    advanceActionLabel: "Advance selected item",
    items: state.items.map((item) => ({ ...item })),
    notes,
    message: state.message
  };
}

export function applyAction(action: string, itemId?: string) {
  if (action === "cycle-primary") {
    state.primaryIndex = (state.primaryIndex + 1) % primaryValues.length;
    state.message = "Privacy Settings" + " moved to " + primaryValues[state.primaryIndex] + ".";
    return;
  }

  if (action === "cycle-secondary") {
    state.secondaryIndex = (state.secondaryIndex + 1) % secondaryValues.length;
    state.message = "Privacy Settings" + " switched to " + secondaryValues[state.secondaryIndex] + ".";
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
    state.message = "Advanced " + itemId + " in Privacy Settings.";
    return;
  }

  if (action === "reset") {
    state.primaryIndex = 0;
    state.secondaryIndex = 0;
    state.items = structuredClone(baseItems);
    state.message = "Privacy Settings workflow reset.";
  }
}
