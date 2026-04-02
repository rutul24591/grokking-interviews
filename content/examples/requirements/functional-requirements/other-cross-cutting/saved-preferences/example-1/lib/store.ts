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

const primaryValues = ["current overrides","backup snapshot","restore preview"];
const secondaryValues = ["user override","team default","system default"];
const statuses = ["ready", "active", "recovering", "blocked"] as const;
const baseItems: Item[] = [
  {
    "id": "sp-1",
    "title": "Current override",
    "subtitle": "Explicit preference saved",
    "detail": "The current explicit preference should survive device changes and team-default updates.",
    "status": "active",
    "flagged": false
  },
  {
    "id": "sp-2",
    "title": "Backup snapshot",
    "subtitle": "Backup and live values differ",
    "detail": "The recovery snapshot and the live preference set no longer match.",
    "status": "recovering",
    "flagged": true
  },
  {
    "id": "sp-3",
    "title": "Restore preview",
    "subtitle": "Rollback impact estimated",
    "detail": "The user can preview which values would be restored from backup.",
    "status": "ready",
    "flagged": false
  }
];
const summary = "Store user preferences durably, detect stale writes, and preview what happens when defaults, overrides, and backups disagree.";
const notes = ["Saved preferences need versioning when multiple devices edit concurrently.","Backup and restore should be selective, not all-or-nothing.","Default inheritance should stay visible even after explicit saves."];

let state: State = {
  primaryIndex: 0,
  secondaryIndex: 0,
  items: structuredClone(baseItems),
  message: "Saved Preferences workflow ready."
};

export function getSnapshot(): Snapshot {
  return {
    title: "Saved Preferences",
    summary,
    primaryLabel: "storage view",
    secondaryLabel: "preference source",
    primaryValue: primaryValues[state.primaryIndex],
    secondaryValue: secondaryValues[state.secondaryIndex],
    primaryActionLabel: "Advance storage view",
    secondaryActionLabel: "Cycle preference source",
    advanceActionLabel: "Advance selected item",
    items: state.items.map((item) => ({ ...item })),
    notes,
    message: state.message
  };
}

export function applyAction(action: string, itemId?: string) {
  if (action === "cycle-primary") {
    state.primaryIndex = (state.primaryIndex + 1) % primaryValues.length;
    state.message = "Saved Preferences" + " moved to " + primaryValues[state.primaryIndex] + ".";
    return;
  }

  if (action === "cycle-secondary") {
    state.secondaryIndex = (state.secondaryIndex + 1) % secondaryValues.length;
    state.message = "Saved Preferences" + " switched to " + secondaryValues[state.secondaryIndex] + ".";
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
    state.message = "Advanced " + itemId + " in Saved Preferences.";
    return;
  }

  if (action === "reset") {
    state.primaryIndex = 0;
    state.secondaryIndex = 0;
    state.items = structuredClone(baseItems);
    state.message = "Saved Preferences workflow reset.";
  }
}
