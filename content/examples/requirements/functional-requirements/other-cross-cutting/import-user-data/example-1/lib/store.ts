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

const primaryValues = ["upload intake","schema validation","merge planning"];
const secondaryValues = ["append only","replace matching","review before merge"];
const statuses = ["ready", "active", "recovering", "blocked"] as const;
const baseItems: Item[] = [
  {
    "id": "imp-1",
    "title": "Upload intake",
    "subtitle": "Archive uploaded",
    "detail": "A user-supplied archive entered intake and needs schema classification.",
    "status": "active",
    "flagged": false
  },
  {
    "id": "imp-2",
    "title": "Schema validation",
    "subtitle": "Unexpected enum values found",
    "detail": "One import file contains legacy values that do not map cleanly to the current schema.",
    "status": "recovering",
    "flagged": true
  },
  {
    "id": "imp-3",
    "title": "Merge planning",
    "subtitle": "Quota and entitlement checks",
    "detail": "The import planner compares incoming data against current account limits and permissions.",
    "status": "ready",
    "flagged": false
  }
];
const summary = "Import user-supplied data safely, validate schemas and provenance, and reconcile imported records against current entitlements and quotas.";
const notes = ["User imports need provenance checks before they touch live state.","Schema validation should explain what was rejected, not just fail the whole import.","Merge plans need quota awareness before the import begins."];

let state: State = {
  primaryIndex: 0,
  secondaryIndex: 0,
  items: structuredClone(baseItems),
  message: "Import User Data workflow ready."
};

export function getSnapshot(): Snapshot {
  return {
    title: "Import User Data",
    summary,
    primaryLabel: "import stage",
    secondaryLabel: "import mode",
    primaryValue: primaryValues[state.primaryIndex],
    secondaryValue: secondaryValues[state.secondaryIndex],
    primaryActionLabel: "Advance import stage",
    secondaryActionLabel: "Cycle import mode",
    advanceActionLabel: "Advance selected item",
    items: state.items.map((item) => ({ ...item })),
    notes,
    message: state.message
  };
}

export function applyAction(action: string, itemId?: string) {
  if (action === "cycle-primary") {
    state.primaryIndex = (state.primaryIndex + 1) % primaryValues.length;
    state.message = "Import User Data" + " moved to " + primaryValues[state.primaryIndex] + ".";
    return;
  }

  if (action === "cycle-secondary") {
    state.secondaryIndex = (state.secondaryIndex + 1) % secondaryValues.length;
    state.message = "Import User Data" + " switched to " + secondaryValues[state.secondaryIndex] + ".";
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
    state.message = "Advanced " + itemId + " in Import User Data.";
    return;
  }

  if (action === "reset") {
    state.primaryIndex = 0;
    state.secondaryIndex = 0;
    state.items = structuredClone(baseItems);
    state.message = "Import User Data workflow reset.";
  }
}
