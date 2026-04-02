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

const primaryValues = ["new reports","evidence validation","appeal review"];
const secondaryValues = ["shield reporter","restrict accused","escalate to trust"];
const statuses = ["ready", "active", "recovering", "blocked"] as const;
const baseItems: Item[] = [
  {
    "id": "report-41",
    "title": "Reporter intake",
    "subtitle": "Harassment report submitted",
    "detail": "Collect screenshots, actor graph context, and prior complaint history before triage closes.",
    "status": "ready",
    "flagged": false
  },
  {
    "id": "report-58",
    "title": "Evidence review",
    "subtitle": "Confidence below auto-action bar",
    "detail": "Evidence conflicts across devices, so the case stays with a human reviewer until corroboration arrives.",
    "status": "recovering",
    "flagged": true
  },
  {
    "id": "report-73",
    "title": "Appeal outcome",
    "subtitle": "Restriction needs confirmation",
    "detail": "The accused actor appealed the limit, and the safety team must confirm whether the signal remains actionable.",
    "status": "active",
    "flagged": false
  }
];
const summary = "Review incoming abuse complaints, preserve reporter safety, and move cases from intake through evidence validation and enforcement.";
const notes = ["Reporter protection must hold even when the accused actor is appealed back into limited visibility.","Duplicate reports should merge evidence, not create parallel enforcement state.","Off-platform threat language needs a higher-confidence escalation lane."];

let state: State = {
  primaryIndex: 0,
  secondaryIndex: 0,
  items: structuredClone(baseItems),
  message: "Abuse Reporting workflow ready."
};

export function getSnapshot(): Snapshot {
  return {
    title: "Abuse Reporting",
    summary,
    primaryLabel: "report stage",
    secondaryLabel: "safety posture",
    primaryValue: primaryValues[state.primaryIndex],
    secondaryValue: secondaryValues[state.secondaryIndex],
    primaryActionLabel: "Advance report stage",
    secondaryActionLabel: "Cycle safety posture",
    advanceActionLabel: "Advance selected item",
    items: state.items.map((item) => ({ ...item })),
    notes,
    message: state.message
  };
}

export function applyAction(action: string, itemId?: string) {
  if (action === "cycle-primary") {
    state.primaryIndex = (state.primaryIndex + 1) % primaryValues.length;
    state.message = "Abuse Reporting" + " moved to " + primaryValues[state.primaryIndex] + ".";
    return;
  }

  if (action === "cycle-secondary") {
    state.secondaryIndex = (state.secondaryIndex + 1) % secondaryValues.length;
    state.message = "Abuse Reporting" + " switched to " + secondaryValues[state.secondaryIndex] + ".";
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
    state.message = "Advanced " + itemId + " in Abuse Reporting.";
    return;
  }

  if (action === "reset") {
    state.primaryIndex = 0;
    state.secondaryIndex = 0;
    state.items = structuredClone(baseItems);
    state.message = "Abuse Reporting workflow reset.";
  }
}
