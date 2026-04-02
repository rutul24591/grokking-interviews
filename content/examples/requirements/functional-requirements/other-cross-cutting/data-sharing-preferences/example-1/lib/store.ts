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

const primaryValues = ["preference capture","partner sync","policy audit"];
const secondaryValues = ["internal only","partners with consent","research opt-in"];
const statuses = ["ready", "active", "recovering", "blocked"] as const;
const baseItems: Item[] = [
  {
    "id": "share-1",
    "title": "Preference matrix",
    "subtitle": "User adjusted partner sharing toggles",
    "detail": "The matrix separates internal analytics, ads partners, and research sharing scopes.",
    "status": "active",
    "flagged": false
  },
  {
    "id": "share-2",
    "title": "Partner sync",
    "subtitle": "One partner export still active",
    "detail": "Preference changes are staged, but one downstream partner has not yet acknowledged the update.",
    "status": "recovering",
    "flagged": true
  },
  {
    "id": "share-3",
    "title": "Audit comparison",
    "subtitle": "Current effective posture visible",
    "detail": "The user can see how current sharing settings compare with the previous consented state.",
    "status": "ready",
    "flagged": false
  }
];
const summary = "Let users control partner and internal data sharing scopes, preview the effect, and reconcile those scopes with existing consent records.";
const notes = ["Data sharing settings should explain each destination, not just each checkbox.","Partner acknowledgements must be visible when the user thinks sharing is already disabled.","Sharing scope and consent scope need deterministic precedence."];

let state: State = {
  primaryIndex: 0,
  secondaryIndex: 0,
  items: structuredClone(baseItems),
  message: "Data Sharing Preferences workflow ready."
};

export function getSnapshot(): Snapshot {
  return {
    title: "Data Sharing Preferences",
    summary,
    primaryLabel: "sharing stage",
    secondaryLabel: "sharing mode",
    primaryValue: primaryValues[state.primaryIndex],
    secondaryValue: secondaryValues[state.secondaryIndex],
    primaryActionLabel: "Advance sharing stage",
    secondaryActionLabel: "Cycle sharing mode",
    advanceActionLabel: "Advance selected item",
    items: state.items.map((item) => ({ ...item })),
    notes,
    message: state.message
  };
}

export function applyAction(action: string, itemId?: string) {
  if (action === "cycle-primary") {
    state.primaryIndex = (state.primaryIndex + 1) % primaryValues.length;
    state.message = "Data Sharing Preferences" + " moved to " + primaryValues[state.primaryIndex] + ".";
    return;
  }

  if (action === "cycle-secondary") {
    state.secondaryIndex = (state.secondaryIndex + 1) % secondaryValues.length;
    state.message = "Data Sharing Preferences" + " switched to " + secondaryValues[state.secondaryIndex] + ".";
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
    state.message = "Advanced " + itemId + " in Data Sharing Preferences.";
    return;
  }

  if (action === "reset") {
    state.primaryIndex = 0;
    state.secondaryIndex = 0;
    state.items = structuredClone(baseItems);
    state.message = "Data Sharing Preferences workflow reset.";
  }
}
