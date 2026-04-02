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

const primaryValues = ["incident capture","candidate selection","restore verification"];
const secondaryValues = ["point-in-time restore","version branch restore","manual reconstruction"];
const statuses = ["ready", "active", "recovering", "blocked"] as const;
const baseItems: Item[] = [
  {
    "id": "rec-1",
    "title": "Incident capture",
    "subtitle": "Author reported accidental loss",
    "detail": "The recovery workflow records when content disappeared and which version boundaries matter.",
    "status": "ready",
    "flagged": false
  },
  {
    "id": "rec-2",
    "title": "Candidate version",
    "subtitle": "Two recovery candidates found",
    "detail": "Multiple snapshots exist, and the system must avoid restoring the wrong version branch.",
    "status": "recovering",
    "flagged": true
  },
  {
    "id": "rec-3",
    "title": "Restore verification",
    "subtitle": "Author preview before publish",
    "detail": "Recovered content is previewed before it becomes visible again.",
    "status": "active",
    "flagged": false
  }
];
const summary = "Restore accidentally removed or corrupted content, reconcile versions, and protect against overwriting newer edits during recovery.";
const notes = ["Recovery should preserve newer edits rather than blindly replacing them.","Version lineage matters when multiple branches diverged before deletion.","Preview-before-restore reduces visible corruption after recovery."];

let state: State = {
  primaryIndex: 0,
  secondaryIndex: 0,
  items: structuredClone(baseItems),
  message: "Content Recovery workflow ready."
};

export function getSnapshot(): Snapshot {
  return {
    title: "Content Recovery",
    summary,
    primaryLabel: "recovery stage",
    secondaryLabel: "recovery mode",
    primaryValue: primaryValues[state.primaryIndex],
    secondaryValue: secondaryValues[state.secondaryIndex],
    primaryActionLabel: "Advance recovery stage",
    secondaryActionLabel: "Cycle recovery mode",
    advanceActionLabel: "Advance selected item",
    items: state.items.map((item) => ({ ...item })),
    notes,
    message: state.message
  };
}

export function applyAction(action: string, itemId?: string) {
  if (action === "cycle-primary") {
    state.primaryIndex = (state.primaryIndex + 1) % primaryValues.length;
    state.message = "Content Recovery" + " moved to " + primaryValues[state.primaryIndex] + ".";
    return;
  }

  if (action === "cycle-secondary") {
    state.secondaryIndex = (state.secondaryIndex + 1) % secondaryValues.length;
    state.message = "Content Recovery" + " switched to " + secondaryValues[state.secondaryIndex] + ".";
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
    state.message = "Advanced " + itemId + " in Content Recovery.";
    return;
  }

  if (action === "reset") {
    state.primaryIndex = 0;
    state.secondaryIndex = 0;
    state.items = structuredClone(baseItems);
    state.message = "Content Recovery workflow reset.";
  }
}
