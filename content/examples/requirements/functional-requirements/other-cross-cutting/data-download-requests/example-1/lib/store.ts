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

const primaryValues = ["request intake","archive build","delivery window"];
const secondaryValues = ["self-serve export","verified handoff","manual compliance export"];
const statuses = ["ready", "active", "recovering", "blocked"] as const;
const baseItems: Item[] = [
  {
    "id": "exp-1",
    "title": "Export request",
    "subtitle": "Identity and scope confirmed",
    "detail": "The requested archive includes account profile, messages, and settings within the allowed scope.",
    "status": "ready",
    "flagged": false
  },
  {
    "id": "exp-2",
    "title": "Archive assembly",
    "subtitle": "Large media bundle pending",
    "detail": "Media-heavy accounts require staged archive building and size-aware delivery.",
    "status": "recovering",
    "flagged": true
  },
  {
    "id": "exp-3",
    "title": "Delivery portal",
    "subtitle": "Download link not yet activated",
    "detail": "The user receives an expiry-bound secure link once the export is assembled.",
    "status": "active",
    "flagged": false
  }
];
const summary = "Prepare user data exports, verify identity, and deliver time-limited archives while surfacing partial exports and readiness state.";
const notes = ["Exports should have stable structure so users can actually inspect them.","Large archives need progress state rather than a single hidden batch job.","Delivery links must expire independently of the underlying export build lifecycle."];

let state: State = {
  primaryIndex: 0,
  secondaryIndex: 0,
  items: structuredClone(baseItems),
  message: "Data Download Requests workflow ready."
};

export function getSnapshot(): Snapshot {
  return {
    title: "Data Download Requests",
    summary,
    primaryLabel: "export stage",
    secondaryLabel: "delivery mode",
    primaryValue: primaryValues[state.primaryIndex],
    secondaryValue: secondaryValues[state.secondaryIndex],
    primaryActionLabel: "Advance export stage",
    secondaryActionLabel: "Cycle delivery mode",
    advanceActionLabel: "Advance selected item",
    items: state.items.map((item) => ({ ...item })),
    notes,
    message: state.message
  };
}

export function applyAction(action: string, itemId?: string) {
  if (action === "cycle-primary") {
    state.primaryIndex = (state.primaryIndex + 1) % primaryValues.length;
    state.message = "Data Download Requests" + " moved to " + primaryValues[state.primaryIndex] + ".";
    return;
  }

  if (action === "cycle-secondary") {
    state.secondaryIndex = (state.secondaryIndex + 1) % secondaryValues.length;
    state.message = "Data Download Requests" + " switched to " + secondaryValues[state.secondaryIndex] + ".";
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
    state.message = "Advanced " + itemId + " in Data Download Requests.";
    return;
  }

  if (action === "reset") {
    state.primaryIndex = 0;
    state.secondaryIndex = 0;
    state.items = structuredClone(baseItems);
    state.message = "Data Download Requests workflow reset.";
  }
}
