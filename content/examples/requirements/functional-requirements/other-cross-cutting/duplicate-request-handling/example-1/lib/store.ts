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

const primaryValues = ["request intake","id reuse check","response replay"];
const secondaryValues = ["strict idempotency","time-box dedupe","manual review"];
const statuses = ["ready", "active", "recovering", "blocked"] as const;
const baseItems: Item[] = [
  {
    "id": "dup-1",
    "title": "Request intake",
    "subtitle": "Client retried after timeout",
    "detail": "The same client request arrived twice because the first response timed out.",
    "status": "active",
    "flagged": false
  },
  {
    "id": "dup-2",
    "title": "Replay lookup",
    "subtitle": "Prior result uncertain",
    "detail": "The system found a matching id but the stored response may be incomplete.",
    "status": "recovering",
    "flagged": true
  },
  {
    "id": "dup-3",
    "title": "Side-effect check",
    "subtitle": "Downstream system must not repeat",
    "detail": "Billing and notification side effects must not fire again during replay.",
    "status": "ready",
    "flagged": false
  }
];
const summary = "Identify duplicate client requests, reuse prior outcomes safely, and prevent double side effects during retries or reconnects.";
const notes = ["Duplicate handling is about side effects, not just response bodies.","Replay state must include whether downstream effects already happened.","A missing request id forces a different path than a duplicate request id."];

let state: State = {
  primaryIndex: 0,
  secondaryIndex: 0,
  items: structuredClone(baseItems),
  message: "Duplicate Request Handling workflow ready."
};

export function getSnapshot(): Snapshot {
  return {
    title: "Duplicate Request Handling",
    summary,
    primaryLabel: "dedupe stage",
    secondaryLabel: "dedupe mode",
    primaryValue: primaryValues[state.primaryIndex],
    secondaryValue: secondaryValues[state.secondaryIndex],
    primaryActionLabel: "Advance dedupe stage",
    secondaryActionLabel: "Cycle dedupe mode",
    advanceActionLabel: "Advance selected item",
    items: state.items.map((item) => ({ ...item })),
    notes,
    message: state.message
  };
}

export function applyAction(action: string, itemId?: string) {
  if (action === "cycle-primary") {
    state.primaryIndex = (state.primaryIndex + 1) % primaryValues.length;
    state.message = "Duplicate Request Handling" + " moved to " + primaryValues[state.primaryIndex] + ".";
    return;
  }

  if (action === "cycle-secondary") {
    state.secondaryIndex = (state.secondaryIndex + 1) % secondaryValues.length;
    state.message = "Duplicate Request Handling" + " switched to " + secondaryValues[state.secondaryIndex] + ".";
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
    state.message = "Advanced " + itemId + " in Duplicate Request Handling.";
    return;
  }

  if (action === "reset") {
    state.primaryIndex = 0;
    state.secondaryIndex = 0;
    state.items = structuredClone(baseItems);
    state.message = "Duplicate Request Handling workflow reset.";
  }
}
