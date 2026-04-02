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

const primaryValues = ["archive plan","visibility removal","restore readiness"];
const secondaryValues = ["manual archive","policy archive","time-based archive"];
const statuses = ["ready", "active", "recovering", "blocked"] as const;
const baseItems: Item[] = [
  {
    "id": "arch-1",
    "title": "Archive plan",
    "subtitle": "Owner requested archive",
    "detail": "The content owner wants the asset hidden from active browsing while retaining editability.",
    "status": "active",
    "flagged": false
  },
  {
    "id": "arch-2",
    "title": "Search cleanup",
    "subtitle": "Search index still stale",
    "detail": "Search and recommendation stores still surface the archived asset until cleanup finishes.",
    "status": "recovering",
    "flagged": true
  },
  {
    "id": "arch-3",
    "title": "Restore pathway",
    "subtitle": "Restore depends on dependencies",
    "detail": "The archived asset can return only after dependencies and scheduled releases are checked.",
    "status": "ready",
    "flagged": false
  }
];
const summary = "Move content out of active visibility without deleting it, preserve restore paths, and keep search and URL behavior consistent.";
const notes = ["Archiving should preserve URLs and ownership metadata.","Archive state must converge across search, feeds, and direct URL access.","Restore should be safer than publish, not a blind toggle."];

let state: State = {
  primaryIndex: 0,
  secondaryIndex: 0,
  items: structuredClone(baseItems),
  message: "Content Archiving workflow ready."
};

export function getSnapshot(): Snapshot {
  return {
    title: "Content Archiving",
    summary,
    primaryLabel: "archive stage",
    secondaryLabel: "archive mode",
    primaryValue: primaryValues[state.primaryIndex],
    secondaryValue: secondaryValues[state.secondaryIndex],
    primaryActionLabel: "Advance archive stage",
    secondaryActionLabel: "Cycle archive mode",
    advanceActionLabel: "Advance selected item",
    items: state.items.map((item) => ({ ...item })),
    notes,
    message: state.message
  };
}

export function applyAction(action: string, itemId?: string) {
  if (action === "cycle-primary") {
    state.primaryIndex = (state.primaryIndex + 1) % primaryValues.length;
    state.message = "Content Archiving" + " moved to " + primaryValues[state.primaryIndex] + ".";
    return;
  }

  if (action === "cycle-secondary") {
    state.secondaryIndex = (state.secondaryIndex + 1) % secondaryValues.length;
    state.message = "Content Archiving" + " switched to " + secondaryValues[state.secondaryIndex] + ".";
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
    state.message = "Advanced " + itemId + " in Content Archiving.";
    return;
  }

  if (action === "reset") {
    state.primaryIndex = 0;
    state.secondaryIndex = 0;
    state.items = structuredClone(baseItems);
    state.message = "Content Archiving workflow reset.";
  }
}
