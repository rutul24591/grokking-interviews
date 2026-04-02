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

const primaryValues = ["failure capture","backoff planning","retry execution"];
const secondaryValues = ["immediate retry","bounded backoff","dead-letter review"];
const statuses = ["ready", "active", "recovering", "blocked"] as const;
const baseItems: Item[] = [
  {
    "id": "ret-1",
    "title": "Failure capture",
    "subtitle": "Dependency timed out",
    "detail": "The request failed with an ambiguous timeout and may or may not have committed remotely.",
    "status": "active",
    "flagged": false
  },
  {
    "id": "ret-2",
    "title": "Backoff planning",
    "subtitle": "Budget nearly exhausted",
    "detail": "The retry budget is almost exhausted and the next attempt may need dead-letter routing.",
    "status": "recovering",
    "flagged": true
  },
  {
    "id": "ret-3",
    "title": "Retry execution",
    "subtitle": "Current attempt visible",
    "detail": "Operators can see when the next retry will fire and why.",
    "status": "ready",
    "flagged": false
  }
];
const summary = "Plan safe retries, show backoff state, and prevent retry storms when dependencies fail or return ambiguous outcomes.";
const notes = ["Retries are safe only when the underlying operation semantics are safe.","Backoff should be visible enough to catch retry storms early.","Dead-letter routing should be a first-class state, not an afterthought."];

let state: State = {
  primaryIndex: 0,
  secondaryIndex: 0,
  items: structuredClone(baseItems),
  message: "Retry Mechanisms workflow ready."
};

export function getSnapshot(): Snapshot {
  return {
    title: "Retry Mechanisms",
    summary,
    primaryLabel: "retry stage",
    secondaryLabel: "retry mode",
    primaryValue: primaryValues[state.primaryIndex],
    secondaryValue: secondaryValues[state.secondaryIndex],
    primaryActionLabel: "Advance retry stage",
    secondaryActionLabel: "Cycle retry mode",
    advanceActionLabel: "Advance selected item",
    items: state.items.map((item) => ({ ...item })),
    notes,
    message: state.message
  };
}

export function applyAction(action: string, itemId?: string) {
  if (action === "cycle-primary") {
    state.primaryIndex = (state.primaryIndex + 1) % primaryValues.length;
    state.message = "Retry Mechanisms" + " moved to " + primaryValues[state.primaryIndex] + ".";
    return;
  }

  if (action === "cycle-secondary") {
    state.secondaryIndex = (state.secondaryIndex + 1) % secondaryValues.length;
    state.message = "Retry Mechanisms" + " switched to " + secondaryValues[state.secondaryIndex] + ".";
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
    state.message = "Advanced " + itemId + " in Retry Mechanisms.";
    return;
  }

  if (action === "reset") {
    state.primaryIndex = 0;
    state.secondaryIndex = 0;
    state.items = structuredClone(baseItems);
    state.message = "Retry Mechanisms workflow reset.";
  }
}
