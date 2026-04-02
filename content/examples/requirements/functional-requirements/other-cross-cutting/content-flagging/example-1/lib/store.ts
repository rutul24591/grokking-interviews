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

const primaryValues = ["incoming flags","visibility hold","policy resolution"];
const secondaryValues = ["leave visible","temporarily hide","geo-restrict"];
const statuses = ["ready", "active", "recovering", "blocked"] as const;
const baseItems: Item[] = [
  {
    "id": "flag-11",
    "title": "Flag intake",
    "subtitle": "Article flagged by three readers",
    "detail": "The same article was flagged for graphic content by multiple readers inside one hour.",
    "status": "ready",
    "flagged": false
  },
  {
    "id": "flag-29",
    "title": "Temporary hold",
    "subtitle": "Visibility reduced pending review",
    "detail": "The asset is hidden from recommendation surfaces until policy review confirms the outcome.",
    "status": "active",
    "flagged": false
  },
  {
    "id": "flag-34",
    "title": "Escalated review",
    "subtitle": "Ambiguous policy match",
    "detail": "The content mixes satire and abuse language, so policy needs an explicit moderator override.",
    "status": "recovering",
    "flagged": true
  }
];
const summary = "Manage user and automated flags on content assets, decide temporary visibility, and route uncertain cases for moderator review.";
const notes = ["Flagging should preserve the asset state that users saw when they filed the report.","Temporary visibility actions must be reversible without losing downstream ranking context.","Policy ambiguity should be explicit so moderators do not overfit to the first reporter narrative."];

let state: State = {
  primaryIndex: 0,
  secondaryIndex: 0,
  items: structuredClone(baseItems),
  message: "Content Flagging workflow ready."
};

export function getSnapshot(): Snapshot {
  return {
    title: "Content Flagging",
    summary,
    primaryLabel: "flag lane",
    secondaryLabel: "asset posture",
    primaryValue: primaryValues[state.primaryIndex],
    secondaryValue: secondaryValues[state.secondaryIndex],
    primaryActionLabel: "Advance flag lane",
    secondaryActionLabel: "Cycle asset posture",
    advanceActionLabel: "Advance selected item",
    items: state.items.map((item) => ({ ...item })),
    notes,
    message: state.message
  };
}

export function applyAction(action: string, itemId?: string) {
  if (action === "cycle-primary") {
    state.primaryIndex = (state.primaryIndex + 1) % primaryValues.length;
    state.message = "Content Flagging" + " moved to " + primaryValues[state.primaryIndex] + ".";
    return;
  }

  if (action === "cycle-secondary") {
    state.secondaryIndex = (state.secondaryIndex + 1) % secondaryValues.length;
    state.message = "Content Flagging" + " switched to " + secondaryValues[state.secondaryIndex] + ".";
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
    state.message = "Advanced " + itemId + " in Content Flagging.";
    return;
  }

  if (action === "reset") {
    state.primaryIndex = 0;
    state.secondaryIndex = 0;
    state.items = structuredClone(baseItems);
    state.message = "Content Flagging workflow reset.";
  }
}
