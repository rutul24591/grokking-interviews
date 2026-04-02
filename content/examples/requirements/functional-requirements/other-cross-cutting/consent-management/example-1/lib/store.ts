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

const primaryValues = ["capture","enforcement","audit replay"];
const secondaryValues = ["opt-in required","legitimate interest","re-consent required"];
const statuses = ["ready", "active", "recovering", "blocked"] as const;
const baseItems: Item[] = [
  {
    "id": "consent-1",
    "title": "Consent record",
    "subtitle": "Current marketing purpose scope",
    "detail": "The latest user decision captures policy version, device, and purpose-specific consent.",
    "status": "active",
    "flagged": false
  },
  {
    "id": "consent-2",
    "title": "Downstream enforcement",
    "subtitle": "One downstream service lagging",
    "detail": "Analytics and marketing suppression disagree on whether the latest consent is already active.",
    "status": "recovering",
    "flagged": true
  },
  {
    "id": "consent-3",
    "title": "Re-consent tracker",
    "subtitle": "Policy change pending user action",
    "detail": "A revised privacy notice forces re-consent before optional processing resumes.",
    "status": "ready",
    "flagged": false
  }
];
const summary = "Track granular user consent decisions, enforcement status, and downstream systems that depend on consent being current and provable.";
const notes = ["Consent needs versioning, provenance, and deterministic downstream replay.","Purpose-level consent is more important than a single global yes/no state.","When policy text changes, stale consent cannot remain silently valid."];

let state: State = {
  primaryIndex: 0,
  secondaryIndex: 0,
  items: structuredClone(baseItems),
  message: "Consent Management workflow ready."
};

export function getSnapshot(): Snapshot {
  return {
    title: "Consent Management",
    summary,
    primaryLabel: "consent state",
    secondaryLabel: "policy stance",
    primaryValue: primaryValues[state.primaryIndex],
    secondaryValue: secondaryValues[state.secondaryIndex],
    primaryActionLabel: "Advance consent state",
    secondaryActionLabel: "Cycle policy stance",
    advanceActionLabel: "Advance selected item",
    items: state.items.map((item) => ({ ...item })),
    notes,
    message: state.message
  };
}

export function applyAction(action: string, itemId?: string) {
  if (action === "cycle-primary") {
    state.primaryIndex = (state.primaryIndex + 1) % primaryValues.length;
    state.message = "Consent Management" + " moved to " + primaryValues[state.primaryIndex] + ".";
    return;
  }

  if (action === "cycle-secondary") {
    state.secondaryIndex = (state.secondaryIndex + 1) % secondaryValues.length;
    state.message = "Consent Management" + " switched to " + secondaryValues[state.secondaryIndex] + ".";
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
    state.message = "Advanced " + itemId + " in Consent Management.";
    return;
  }

  if (action === "reset") {
    state.primaryIndex = 0;
    state.secondaryIndex = 0;
    state.items = structuredClone(baseItems);
    state.message = "Consent Management workflow reset.";
  }
}
