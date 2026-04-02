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

const primaryValues = ["request intake","processor coordination","deadline audit"];
const secondaryValues = ["access","erasure","restriction"];
const statuses = ["ready", "active", "recovering", "blocked"] as const;
const baseItems: Item[] = [
  {
    "id": "gdpr-1",
    "title": "Rights intake",
    "subtitle": "Subject request identified",
    "detail": "The request captures the exact GDPR right, the locale, and the verification checkpoint.",
    "status": "active",
    "flagged": false
  },
  {
    "id": "gdpr-2",
    "title": "Processor coordination",
    "subtitle": "Third-party acknowledgements incomplete",
    "detail": "External processors still owe confirmation on whether they fulfilled the request scope.",
    "status": "recovering",
    "flagged": true
  },
  {
    "id": "gdpr-3",
    "title": "Deadline tracking",
    "subtitle": "Clock and extension visible",
    "detail": "The fulfillment deadline and any permitted extension remain visible to compliance owners.",
    "status": "ready",
    "flagged": false
  }
];
const summary = "Coordinate GDPR rights requests, track legal timelines, and make fulfillment state auditable across multiple rights and processors.";
const notes = ["GDPR workflows need to separate right type from fulfillment mechanism.","Processor acknowledgements matter as much as first-party completion.","Deadline extensions should be explicit, time-bounded, and justified."];

let state: State = {
  primaryIndex: 0,
  secondaryIndex: 0,
  items: structuredClone(baseItems),
  message: "GDPR Data Requests workflow ready."
};

export function getSnapshot(): Snapshot {
  return {
    title: "GDPR Data Requests",
    summary,
    primaryLabel: "rights workflow",
    secondaryLabel: "right invoked",
    primaryValue: primaryValues[state.primaryIndex],
    secondaryValue: secondaryValues[state.secondaryIndex],
    primaryActionLabel: "Advance rights workflow",
    secondaryActionLabel: "Cycle right invoked",
    advanceActionLabel: "Advance selected item",
    items: state.items.map((item) => ({ ...item })),
    notes,
    message: state.message
  };
}

export function applyAction(action: string, itemId?: string) {
  if (action === "cycle-primary") {
    state.primaryIndex = (state.primaryIndex + 1) % primaryValues.length;
    state.message = "GDPR Data Requests" + " moved to " + primaryValues[state.primaryIndex] + ".";
    return;
  }

  if (action === "cycle-secondary") {
    state.secondaryIndex = (state.secondaryIndex + 1) % secondaryValues.length;
    state.message = "GDPR Data Requests" + " switched to " + secondaryValues[state.secondaryIndex] + ".";
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
    state.message = "Advanced " + itemId + " in GDPR Data Requests.";
    return;
  }

  if (action === "reset") {
    state.primaryIndex = 0;
    state.secondaryIndex = 0;
    state.items = structuredClone(baseItems);
    state.message = "GDPR Data Requests workflow reset.";
  }
}
