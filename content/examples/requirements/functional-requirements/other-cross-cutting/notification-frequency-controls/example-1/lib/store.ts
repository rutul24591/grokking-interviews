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

const primaryValues = ["budget setup","quiet-hours policy","burst recovery"];
const secondaryValues = ["real time","bundled","quiet-hours only"];
const statuses = ["ready", "active", "recovering", "blocked"] as const;
const baseItems: Item[] = [
  {
    "id": "freq-1",
    "title": "Budget rule",
    "subtitle": "Per-day notification cap set",
    "detail": "The user has capped high-volume notifications to protect attention budget.",
    "status": "active",
    "flagged": false
  },
  {
    "id": "freq-2",
    "title": "Quiet hours",
    "subtitle": "Regional window mismatch",
    "detail": "One configured timezone disagrees with the quiet-hours evaluation used by push delivery.",
    "status": "recovering",
    "flagged": true
  },
  {
    "id": "freq-3",
    "title": "Burst recovery",
    "subtitle": "Backlog batching visible",
    "detail": "The system preview shows how queued notifications will be reintroduced after a mute window.",
    "status": "ready",
    "flagged": false
  }
];
const summary = "Throttle notification volume, align send cadence to quiet-hours rules, and prevent bursts after backlog recovery.";
const notes = ["Frequency controls should account for both channel and category volume.","Quiet-hours rules are only useful if every delivery channel honors them.","Backlog recovery needs bundling to avoid bursty catch-up behavior."];

let state: State = {
  primaryIndex: 0,
  secondaryIndex: 0,
  items: structuredClone(baseItems),
  message: "Notification Frequency Controls workflow ready."
};

export function getSnapshot(): Snapshot {
  return {
    title: "Notification Frequency Controls",
    summary,
    primaryLabel: "frequency view",
    secondaryLabel: "frequency mode",
    primaryValue: primaryValues[state.primaryIndex],
    secondaryValue: secondaryValues[state.secondaryIndex],
    primaryActionLabel: "Advance frequency view",
    secondaryActionLabel: "Cycle frequency mode",
    advanceActionLabel: "Advance selected item",
    items: state.items.map((item) => ({ ...item })),
    notes,
    message: state.message
  };
}

export function applyAction(action: string, itemId?: string) {
  if (action === "cycle-primary") {
    state.primaryIndex = (state.primaryIndex + 1) % primaryValues.length;
    state.message = "Notification Frequency Controls" + " moved to " + primaryValues[state.primaryIndex] + ".";
    return;
  }

  if (action === "cycle-secondary") {
    state.secondaryIndex = (state.secondaryIndex + 1) % secondaryValues.length;
    state.message = "Notification Frequency Controls" + " switched to " + secondaryValues[state.secondaryIndex] + ".";
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
    state.message = "Advanced " + itemId + " in Notification Frequency Controls.";
    return;
  }

  if (action === "reset") {
    state.primaryIndex = 0;
    state.secondaryIndex = 0;
    state.items = structuredClone(baseItems);
    state.message = "Notification Frequency Controls workflow reset.";
  }
}
