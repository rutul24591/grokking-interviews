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

const primaryValues = ["prompt display","version recording","access gating"];
const secondaryValues = ["hard gate","soft reminder","jurisdiction override"];
const statuses = ["ready", "active", "recovering", "blocked"] as const;
const baseItems: Item[] = [
  {
    "id": "terms-1",
    "title": "Prompt state",
    "subtitle": "Current legal version shown",
    "detail": "The user is being prompted to accept a new terms version before continuing.",
    "status": "active",
    "flagged": false
  },
  {
    "id": "terms-2",
    "title": "Version record",
    "subtitle": "Missing provenance on one event",
    "detail": "One acceptance event lacks the device and locale metadata needed for legal proof.",
    "status": "recovering",
    "flagged": true
  },
  {
    "id": "terms-3",
    "title": "Access gate",
    "subtitle": "Feature access depends on acceptance",
    "detail": "Some premium or jurisdiction-sensitive features remain gated until acceptance is complete.",
    "status": "ready",
    "flagged": false
  }
];
const summary = "Record acceptance of changing legal terms, maintain version history, and gate product access when required acceptance is missing.";
const notes = ["Terms acceptance is a legal record first and a UI event second.","Version provenance needs device, locale, and policy hash metadata.","Soft reminders should not be used where hard gates are legally required."];

let state: State = {
  primaryIndex: 0,
  secondaryIndex: 0,
  items: structuredClone(baseItems),
  message: "Terms Acceptance Tracking workflow ready."
};

export function getSnapshot(): Snapshot {
  return {
    title: "Terms Acceptance Tracking",
    summary,
    primaryLabel: "acceptance stage",
    secondaryLabel: "acceptance mode",
    primaryValue: primaryValues[state.primaryIndex],
    secondaryValue: secondaryValues[state.secondaryIndex],
    primaryActionLabel: "Advance acceptance stage",
    secondaryActionLabel: "Cycle acceptance mode",
    advanceActionLabel: "Advance selected item",
    items: state.items.map((item) => ({ ...item })),
    notes,
    message: state.message
  };
}

export function applyAction(action: string, itemId?: string) {
  if (action === "cycle-primary") {
    state.primaryIndex = (state.primaryIndex + 1) % primaryValues.length;
    state.message = "Terms Acceptance Tracking" + " moved to " + primaryValues[state.primaryIndex] + ".";
    return;
  }

  if (action === "cycle-secondary") {
    state.secondaryIndex = (state.secondaryIndex + 1) % secondaryValues.length;
    state.message = "Terms Acceptance Tracking" + " switched to " + secondaryValues[state.secondaryIndex] + ".";
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
    state.message = "Advanced " + itemId + " in Terms Acceptance Tracking.";
    return;
  }

  if (action === "reset") {
    state.primaryIndex = 0;
    state.secondaryIndex = 0;
    state.items = structuredClone(baseItems);
    state.message = "Terms Acceptance Tracking workflow reset.";
  }
}
