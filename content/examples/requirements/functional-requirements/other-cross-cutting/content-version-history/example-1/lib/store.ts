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

const primaryValues = ["revision browse","diff compare","rollback planning"];
const secondaryValues = ["linear history","branched edits","approved versions only"];
const statuses = ["ready", "active", "recovering", "blocked"] as const;
const baseItems: Item[] = [
  {
    "id": "vh-1",
    "title": "Revision timeline",
    "subtitle": "Recent edits visible",
    "detail": "Editors can see who changed what and when across the most recent versions.",
    "status": "active",
    "flagged": false
  },
  {
    "id": "vh-2",
    "title": "Diff compare",
    "subtitle": "Two revisions conflict on metadata",
    "detail": "The latest metadata edits conflict with an older body-only revert candidate.",
    "status": "recovering",
    "flagged": true
  },
  {
    "id": "vh-3",
    "title": "Rollback planner",
    "subtitle": "Rollback impact estimated",
    "detail": "The system estimates which dependencies and comments would be affected by a rollback.",
    "status": "ready",
    "flagged": false
  }
];
const summary = "Expose the evolution of a content asset, compare revisions safely, and make rollback decisions without losing intervening work.";
const notes = ["Version history should distinguish metadata-only edits from content edits.","Rollback decisions need impact estimates, not just diff views.","Branched revision histories need stronger guidance than linear ones."];

let state: State = {
  primaryIndex: 0,
  secondaryIndex: 0,
  items: structuredClone(baseItems),
  message: "Content Version History workflow ready."
};

export function getSnapshot(): Snapshot {
  return {
    title: "Content Version History",
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
    state.message = "Content Version History" + " moved to " + primaryValues[state.primaryIndex] + ".";
    return;
  }

  if (action === "cycle-secondary") {
    state.secondaryIndex = (state.secondaryIndex + 1) % secondaryValues.length;
    state.message = "Content Version History" + " switched to " + secondaryValues[state.secondaryIndex] + ".";
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
    state.message = "Advanced " + itemId + " in Content Version History.";
    return;
  }

  if (action === "reset") {
    state.primaryIndex = 0;
    state.secondaryIndex = 0;
    state.items = structuredClone(baseItems);
    state.message = "Content Version History workflow reset.";
  }
}
