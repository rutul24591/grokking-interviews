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

const primaryValues = ["recent access","justification review","anomaly follow-up"];
const secondaryValues = ["user visible","admin expanded","security investigation"];
const statuses = ["ready", "active", "recovering", "blocked"] as const;
const baseItems: Item[] = [
  {
    "id": "log-1",
    "title": "Recent access",
    "subtitle": "Billing profile viewed by support",
    "detail": "A recent support action accessed billing information with a recorded justification.",
    "status": "active",
    "flagged": false
  },
  {
    "id": "log-2",
    "title": "Justification review",
    "subtitle": "One access lacks complete reason",
    "detail": "An access record still misses the final support ticket reference.",
    "status": "recovering",
    "flagged": true
  },
  {
    "id": "log-3",
    "title": "Anomaly follow-up",
    "subtitle": "Off-hours access cluster found",
    "detail": "The system grouped several off-hours accesses into one anomaly case for review.",
    "status": "ready",
    "flagged": false
  }
];
const summary = "Show users and operators where sensitive data was accessed, how access was justified, and which entries still need review.";
const notes = ["Access logs need audience-appropriate detail: users see less than admins.","Justification quality matters as much as event presence.","Anomalies should cluster related events so review is tractable."];

let state: State = {
  primaryIndex: 0,
  secondaryIndex: 0,
  items: structuredClone(baseItems),
  message: "Access History Logs workflow ready."
};

export function getSnapshot(): Snapshot {
  return {
    title: "Access History Logs",
    summary,
    primaryLabel: "history view",
    secondaryLabel: "log mode",
    primaryValue: primaryValues[state.primaryIndex],
    secondaryValue: secondaryValues[state.secondaryIndex],
    primaryActionLabel: "Advance history view",
    secondaryActionLabel: "Cycle log mode",
    advanceActionLabel: "Advance selected item",
    items: state.items.map((item) => ({ ...item })),
    notes,
    message: state.message
  };
}

export function applyAction(action: string, itemId?: string) {
  if (action === "cycle-primary") {
    state.primaryIndex = (state.primaryIndex + 1) % primaryValues.length;
    state.message = "Access History Logs" + " moved to " + primaryValues[state.primaryIndex] + ".";
    return;
  }

  if (action === "cycle-secondary") {
    state.secondaryIndex = (state.secondaryIndex + 1) % secondaryValues.length;
    state.message = "Access History Logs" + " switched to " + secondaryValues[state.secondaryIndex] + ".";
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
    state.message = "Advanced " + itemId + " in Access History Logs.";
    return;
  }

  if (action === "reset") {
    state.primaryIndex = 0;
    state.secondaryIndex = 0;
    state.items = structuredClone(baseItems);
    state.message = "Access History Logs workflow reset.";
  }
}
