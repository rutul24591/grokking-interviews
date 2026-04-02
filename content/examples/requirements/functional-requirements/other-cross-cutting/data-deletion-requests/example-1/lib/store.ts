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

const primaryValues = ["identity verification","deletion planning","fulfillment confirmation"];
const secondaryValues = ["full deletion","partial with legal hold","manual verification"];
const statuses = ["ready", "active", "recovering", "blocked"] as const;
const baseItems: Item[] = [
  {
    "id": "del-1",
    "title": "Identity check",
    "subtitle": "Requester verified by session and email",
    "detail": "Deletion cannot proceed until the request is tied to the correct principal and account boundary.",
    "status": "active",
    "flagged": false
  },
  {
    "id": "del-2",
    "title": "Scope narrowing",
    "subtitle": "Shared workspace data remains",
    "detail": "Some data belongs to collaborative workspaces and cannot be removed without reassignment.",
    "status": "recovering",
    "flagged": true
  },
  {
    "id": "del-3",
    "title": "Fulfillment notice",
    "subtitle": "Deletion summary pending delivery",
    "detail": "The user sees what was deleted, retained, and placed under legal retention.",
    "status": "ready",
    "flagged": false
  }
];
const summary = "Collect deletion requests, verify the requester, narrow scope against shared/legal data, and publish fulfillment status back to the user.";
const notes = ["Deletion requests need a user-facing explanation for retained records.","Collaborative content and fraud records often require partial fulfillment, not silent rejection.","Every deletion plan should bind to a stable legal-hold snapshot."];

let state: State = {
  primaryIndex: 0,
  secondaryIndex: 0,
  items: structuredClone(baseItems),
  message: "Data Deletion Requests workflow ready."
};

export function getSnapshot(): Snapshot {
  return {
    title: "Data Deletion Requests",
    summary,
    primaryLabel: "request stage",
    secondaryLabel: "request posture",
    primaryValue: primaryValues[state.primaryIndex],
    secondaryValue: secondaryValues[state.secondaryIndex],
    primaryActionLabel: "Advance request stage",
    secondaryActionLabel: "Cycle request posture",
    advanceActionLabel: "Advance selected item",
    items: state.items.map((item) => ({ ...item })),
    notes,
    message: state.message
  };
}

export function applyAction(action: string, itemId?: string) {
  if (action === "cycle-primary") {
    state.primaryIndex = (state.primaryIndex + 1) % primaryValues.length;
    state.message = "Data Deletion Requests" + " moved to " + primaryValues[state.primaryIndex] + ".";
    return;
  }

  if (action === "cycle-secondary") {
    state.secondaryIndex = (state.secondaryIndex + 1) % secondaryValues.length;
    state.message = "Data Deletion Requests" + " switched to " + secondaryValues[state.secondaryIndex] + ".";
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
    state.message = "Advanced " + itemId + " in Data Deletion Requests.";
    return;
  }

  if (action === "reset") {
    state.primaryIndex = 0;
    state.secondaryIndex = 0;
    state.items = structuredClone(baseItems);
    state.message = "Data Deletion Requests workflow reset.";
  }
}
