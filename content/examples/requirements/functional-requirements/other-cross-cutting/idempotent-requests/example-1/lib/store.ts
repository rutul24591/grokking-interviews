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

const primaryValues = ["key intake","execution guarantee","replay verification"];
const secondaryValues = ["strong replay","scoped replay","best effort"];
const statuses = ["ready", "active", "recovering", "blocked"] as const;
const baseItems: Item[] = [
  {
    "id": "idem-1",
    "title": "Key intake",
    "subtitle": "Idempotency key accepted",
    "detail": "The request carries a well-scoped key tied to the intended operation.",
    "status": "active",
    "flagged": false
  },
  {
    "id": "idem-2",
    "title": "Execution guarantee",
    "subtitle": "One downstream side effect missing",
    "detail": "The request ledger says the command ran, but one downstream side effect did not confirm.",
    "status": "recovering",
    "flagged": true
  },
  {
    "id": "idem-3",
    "title": "Replay verification",
    "subtitle": "Operator can inspect prior outcome",
    "detail": "Operators can inspect the prior result that would be replayed to the client.",
    "status": "ready",
    "flagged": false
  }
];
const summary = "Guarantee a request can be retried safely, keep request keys scoped correctly, and surface replay guarantees to operators.";
const notes = ["Idempotency keys need scope boundaries, not just uniqueness.","The operator view must separate replayable completion from partial execution.","Client-visible replay guarantees should match backend reality."];

let state: State = {
  primaryIndex: 0,
  secondaryIndex: 0,
  items: structuredClone(baseItems),
  message: "Idempotent Requests workflow ready."
};

export function getSnapshot(): Snapshot {
  return {
    title: "Idempotent Requests",
    summary,
    primaryLabel: "idempotency stage",
    secondaryLabel: "guarantee mode",
    primaryValue: primaryValues[state.primaryIndex],
    secondaryValue: secondaryValues[state.secondaryIndex],
    primaryActionLabel: "Advance idempotency stage",
    secondaryActionLabel: "Cycle guarantee mode",
    advanceActionLabel: "Advance selected item",
    items: state.items.map((item) => ({ ...item })),
    notes,
    message: state.message
  };
}

export function applyAction(action: string, itemId?: string) {
  if (action === "cycle-primary") {
    state.primaryIndex = (state.primaryIndex + 1) % primaryValues.length;
    state.message = "Idempotent Requests" + " moved to " + primaryValues[state.primaryIndex] + ".";
    return;
  }

  if (action === "cycle-secondary") {
    state.secondaryIndex = (state.secondaryIndex + 1) % secondaryValues.length;
    state.message = "Idempotent Requests" + " switched to " + secondaryValues[state.secondaryIndex] + ".";
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
    state.message = "Advanced " + itemId + " in Idempotent Requests.";
    return;
  }

  if (action === "reset") {
    state.primaryIndex = 0;
    state.secondaryIndex = 0;
    state.items = structuredClone(baseItems);
    state.message = "Idempotent Requests workflow reset.";
  }
}
