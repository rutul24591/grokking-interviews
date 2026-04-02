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

const primaryValues = ["collection planning","bundle assembly","user handoff"];
const secondaryValues = ["profile only","full archive","compliance redaction"];
const statuses = ["ready", "active", "recovering", "blocked"] as const;
const baseItems: Item[] = [
  {
    "id": "bundle-1",
    "title": "Collection plan",
    "subtitle": "Export categories selected",
    "detail": "The export planner decides which sources and redactions belong in the final archive.",
    "status": "ready",
    "flagged": false
  },
  {
    "id": "bundle-2",
    "title": "Bundle assembly",
    "subtitle": "Slow dependency still running",
    "detail": "A dependent service has not finished serializing its portion of the archive.",
    "status": "recovering",
    "flagged": true
  },
  {
    "id": "bundle-3",
    "title": "User handoff",
    "subtitle": "Secure delivery waiting",
    "detail": "The secure archive is ready but still waiting for a download link activation.",
    "status": "active",
    "flagged": false
  }
];
const summary = "Plan and deliver portable user data exports with category-level progress, retention windows, and delivery acknowledgements.";
const notes = ["Portable exports should describe omitted fields and redactions explicitly.","Long-running archive builds need user-facing progress, not silent email-only updates.","Retention of completed exports must be shorter than retention of the underlying data."];

let state: State = {
  primaryIndex: 0,
  secondaryIndex: 0,
  items: structuredClone(baseItems),
  message: "Export User Data workflow ready."
};

export function getSnapshot(): Snapshot {
  return {
    title: "Export User Data",
    summary,
    primaryLabel: "export lifecycle",
    secondaryLabel: "bundle mode",
    primaryValue: primaryValues[state.primaryIndex],
    secondaryValue: secondaryValues[state.secondaryIndex],
    primaryActionLabel: "Advance export lifecycle",
    secondaryActionLabel: "Cycle bundle mode",
    advanceActionLabel: "Advance selected item",
    items: state.items.map((item) => ({ ...item })),
    notes,
    message: state.message
  };
}

export function applyAction(action: string, itemId?: string) {
  if (action === "cycle-primary") {
    state.primaryIndex = (state.primaryIndex + 1) % primaryValues.length;
    state.message = "Export User Data" + " moved to " + primaryValues[state.primaryIndex] + ".";
    return;
  }

  if (action === "cycle-secondary") {
    state.secondaryIndex = (state.secondaryIndex + 1) % secondaryValues.length;
    state.message = "Export User Data" + " switched to " + secondaryValues[state.secondaryIndex] + ".";
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
    state.message = "Advanced " + itemId + " in Export User Data.";
    return;
  }

  if (action === "reset") {
    state.primaryIndex = 0;
    state.secondaryIndex = 0;
    state.items = structuredClone(baseItems);
    state.message = "Export User Data workflow reset.";
  }
}
