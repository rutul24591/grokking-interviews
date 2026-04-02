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

const primaryValues = ["local autosave","server sync","conflict resolution"];
const secondaryValues = ["manual save","autosave","offline queue"];
const statuses = ["ready", "active", "recovering", "blocked"] as const;
const baseItems: Item[] = [
  {
    "id": "dr-1",
    "title": "Autosave heartbeat",
    "subtitle": "Local change buffered",
    "detail": "Recent edits are buffered locally and scheduled for background persistence.",
    "status": "active",
    "flagged": false
  },
  {
    "id": "dr-2",
    "title": "Server sync lag",
    "subtitle": "One tab has stale version",
    "detail": "A second browser tab is writing against an older draft version.",
    "status": "recovering",
    "flagged": true
  },
  {
    "id": "dr-3",
    "title": "Conflict resolver",
    "subtitle": "Merge guidance visible",
    "detail": "The author can choose server copy, local copy, or a merged draft before continuing.",
    "status": "ready",
    "flagged": false
  }
];
const summary = "Save user drafts incrementally, surface autosave health, and resolve stale write conflicts across tabs and devices.";
const notes = ["Draft saving must surface sync health before the author loses trust.","Autosave and explicit save need a coherent version story.","Offline queued drafts require careful replay once connectivity returns."];

let state: State = {
  primaryIndex: 0,
  secondaryIndex: 0,
  items: structuredClone(baseItems),
  message: "Draft Saving workflow ready."
};

export function getSnapshot(): Snapshot {
  return {
    title: "Draft Saving",
    summary,
    primaryLabel: "draft stage",
    secondaryLabel: "save mode",
    primaryValue: primaryValues[state.primaryIndex],
    secondaryValue: secondaryValues[state.secondaryIndex],
    primaryActionLabel: "Advance draft stage",
    secondaryActionLabel: "Cycle save mode",
    advanceActionLabel: "Advance selected item",
    items: state.items.map((item) => ({ ...item })),
    notes,
    message: state.message
  };
}

export function applyAction(action: string, itemId?: string) {
  if (action === "cycle-primary") {
    state.primaryIndex = (state.primaryIndex + 1) % primaryValues.length;
    state.message = "Draft Saving" + " moved to " + primaryValues[state.primaryIndex] + ".";
    return;
  }

  if (action === "cycle-secondary") {
    state.secondaryIndex = (state.secondaryIndex + 1) % secondaryValues.length;
    state.message = "Draft Saving" + " switched to " + secondaryValues[state.secondaryIndex] + ".";
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
    state.message = "Advanced " + itemId + " in Draft Saving.";
    return;
  }

  if (action === "reset") {
    state.primaryIndex = 0;
    state.secondaryIndex = 0;
    state.items = structuredClone(baseItems);
    state.message = "Draft Saving workflow reset.";
  }
}
