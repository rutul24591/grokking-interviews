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

const primaryValues = ["preference selection","surface preview","cache sync"];
const secondaryValues = ["system","light","dark"];
const statuses = ["ready", "active", "recovering", "blocked"] as const;
const baseItems: Item[] = [
  {
    "id": "theme-1",
    "title": "Theme selection",
    "subtitle": "Dark theme selected",
    "detail": "The user selected dark mode explicitly instead of inheriting the system theme.",
    "status": "active",
    "flagged": false
  },
  {
    "id": "theme-2",
    "title": "Surface preview",
    "subtitle": "One embedded surface still light",
    "detail": "An embedded settings pane still renders with the previous light theme.",
    "status": "recovering",
    "flagged": true
  },
  {
    "id": "theme-3",
    "title": "Sync state",
    "subtitle": "Cached theme update pending",
    "detail": "A stale cached stylesheet prevents immediate full-theme convergence.",
    "status": "ready",
    "flagged": false
  }
];
const summary = "Switch between system, light, and dark themes while previewing cross-surface consistency and stale cached themes.";
const notes = ["Theme settings should preview the effective theme on all major surfaces.","System-theme inheritance is different from an explicit saved choice.","Cached styles and iframes often lag behind the main shell."];

let state: State = {
  primaryIndex: 0,
  secondaryIndex: 0,
  items: structuredClone(baseItems),
  message: "Theme Settings workflow ready."
};

export function getSnapshot(): Snapshot {
  return {
    title: "Theme Settings",
    summary,
    primaryLabel: "theme view",
    secondaryLabel: "theme source",
    primaryValue: primaryValues[state.primaryIndex],
    secondaryValue: secondaryValues[state.secondaryIndex],
    primaryActionLabel: "Advance theme view",
    secondaryActionLabel: "Cycle theme source",
    advanceActionLabel: "Advance selected item",
    items: state.items.map((item) => ({ ...item })),
    notes,
    message: state.message
  };
}

export function applyAction(action: string, itemId?: string) {
  if (action === "cycle-primary") {
    state.primaryIndex = (state.primaryIndex + 1) % primaryValues.length;
    state.message = "Theme Settings" + " moved to " + primaryValues[state.primaryIndex] + ".";
    return;
  }

  if (action === "cycle-secondary") {
    state.secondaryIndex = (state.secondaryIndex + 1) % secondaryValues.length;
    state.message = "Theme Settings" + " switched to " + secondaryValues[state.secondaryIndex] + ".";
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
    state.message = "Advanced " + itemId + " in Theme Settings.";
    return;
  }

  if (action === "reset") {
    state.primaryIndex = 0;
    state.secondaryIndex = 0;
    state.items = structuredClone(baseItems);
    state.message = "Theme Settings workflow reset.";
  }
}
