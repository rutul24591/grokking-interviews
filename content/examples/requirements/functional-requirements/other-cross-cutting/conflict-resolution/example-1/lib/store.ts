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

const primaryValues = ["detection","resolution choice","repair confirmation"];
const secondaryValues = ["last write wins disabled","merge where safe","manual adjudication"];
const statuses = ["ready", "active", "recovering", "blocked"] as const;
const baseItems: Item[] = [
  {
    "id": "conf-1",
    "title": "Conflict detection",
    "subtitle": "Two writes overlap",
    "detail": "Concurrent writes changed the same logical record with incompatible versions.",
    "status": "active",
    "flagged": false
  },
  {
    "id": "conf-2",
    "title": "Merge attempt",
    "subtitle": "Automatic merge uncertain",
    "detail": "A structural merge is possible but may discard one actor intent.",
    "status": "recovering",
    "flagged": true
  },
  {
    "id": "conf-3",
    "title": "Repair confirmation",
    "subtitle": "Final state preview ready",
    "detail": "The system previews the post-merge or post-retry state before final commit.",
    "status": "ready",
    "flagged": false
  }
];
const summary = "Resolve concurrent writes safely, show users why conflicts happened, and choose merge, retry, or manual review paths.";
const notes = ["Conflict resolution should preserve user intent, not just data shape.","Automatic merge is only safe when fields are independent.","Users need to see the outcome before the repair is committed."];

let state: State = {
  primaryIndex: 0,
  secondaryIndex: 0,
  items: structuredClone(baseItems),
  message: "Conflict Resolution workflow ready."
};

export function getSnapshot(): Snapshot {
  return {
    title: "Conflict Resolution",
    summary,
    primaryLabel: "conflict stage",
    secondaryLabel: "resolution mode",
    primaryValue: primaryValues[state.primaryIndex],
    secondaryValue: secondaryValues[state.secondaryIndex],
    primaryActionLabel: "Advance conflict stage",
    secondaryActionLabel: "Cycle resolution mode",
    advanceActionLabel: "Advance selected item",
    items: state.items.map((item) => ({ ...item })),
    notes,
    message: state.message
  };
}

export function applyAction(action: string, itemId?: string) {
  if (action === "cycle-primary") {
    state.primaryIndex = (state.primaryIndex + 1) % primaryValues.length;
    state.message = "Conflict Resolution" + " moved to " + primaryValues[state.primaryIndex] + ".";
    return;
  }

  if (action === "cycle-secondary") {
    state.secondaryIndex = (state.secondaryIndex + 1) % secondaryValues.length;
    state.message = "Conflict Resolution" + " switched to " + secondaryValues[state.secondaryIndex] + ".";
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
    state.message = "Advanced " + itemId + " in Conflict Resolution.";
    return;
  }

  if (action === "reset") {
    state.primaryIndex = 0;
    state.secondaryIndex = 0;
    state.items = structuredClone(baseItems);
    state.message = "Conflict Resolution workflow reset.";
  }
}
