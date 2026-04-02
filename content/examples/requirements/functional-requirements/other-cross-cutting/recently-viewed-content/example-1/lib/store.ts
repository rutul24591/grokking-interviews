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

const primaryValues = ["view capture","history ordering","retention cleanup"];
const secondaryValues = ["full history","session only","privacy reduced"];
const statuses = ["ready", "active", "recovering", "blocked"] as const;
const baseItems: Item[] = [
  {
    "id": "rv-1",
    "title": "View capture",
    "subtitle": "Recent article stored",
    "detail": "A recent article view has been persisted into the history ledger.",
    "status": "active",
    "flagged": false
  },
  {
    "id": "rv-2",
    "title": "Ordering repair",
    "subtitle": "Cross-device order mismatch",
    "detail": "Mobile and web devices disagree on the latest ordering of viewed items.",
    "status": "recovering",
    "flagged": true
  },
  {
    "id": "rv-3",
    "title": "Retention cleanup",
    "subtitle": "Expired item purge visible",
    "detail": "The retention job is removing old entries while preserving the newest items.",
    "status": "ready",
    "flagged": false
  }
];
const summary = "Track recently viewed items, respect privacy and retention rules, and recover gracefully when history is partial or stale.";
const notes = ["Recently viewed lists need consistent ordering across devices.","Privacy-reduced modes may keep recency without keeping full identity.","Retention behavior should be visible when history seems to disappear."];

let state: State = {
  primaryIndex: 0,
  secondaryIndex: 0,
  items: structuredClone(baseItems),
  message: "Recently Viewed Content workflow ready."
};

export function getSnapshot(): Snapshot {
  return {
    title: "Recently Viewed Content",
    summary,
    primaryLabel: "history stage",
    secondaryLabel: "history mode",
    primaryValue: primaryValues[state.primaryIndex],
    secondaryValue: secondaryValues[state.secondaryIndex],
    primaryActionLabel: "Advance history stage",
    secondaryActionLabel: "Cycle history mode",
    advanceActionLabel: "Advance selected item",
    items: state.items.map((item) => ({ ...item })),
    notes,
    message: state.message
  };
}

export function applyAction(action: string, itemId?: string) {
  if (action === "cycle-primary") {
    state.primaryIndex = (state.primaryIndex + 1) % primaryValues.length;
    state.message = "Recently Viewed Content" + " moved to " + primaryValues[state.primaryIndex] + ".";
    return;
  }

  if (action === "cycle-secondary") {
    state.secondaryIndex = (state.secondaryIndex + 1) % secondaryValues.length;
    state.message = "Recently Viewed Content" + " switched to " + secondaryValues[state.secondaryIndex] + ".";
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
    state.message = "Advanced " + itemId + " in Recently Viewed Content.";
    return;
  }

  if (action === "reset") {
    state.primaryIndex = 0;
    state.secondaryIndex = 0;
    state.items = structuredClone(baseItems);
    state.message = "Recently Viewed Content workflow reset.";
  }
}
