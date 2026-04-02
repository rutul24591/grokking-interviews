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

const primaryValues = ["stream scoring","review queue","model tuning"];
const secondaryValues = ["observe only","shadow throttle","hard limit"];
const statuses = ["ready", "active", "recovering", "blocked"] as const;
const baseItems: Item[] = [
  {
    "id": "spam-14",
    "title": "Burst detector",
    "subtitle": "Outbound link spike found",
    "detail": "A burst of near-identical outbound link posts crossed the spam threshold.",
    "status": "active",
    "flagged": false
  },
  {
    "id": "spam-19",
    "title": "Manual sample review",
    "subtitle": "False-positive risk elevated",
    "detail": "The detector matched on a legitimate campaign pattern, so human sampling is still required.",
    "status": "recovering",
    "flagged": true
  },
  {
    "id": "spam-28",
    "title": "Model feedback",
    "subtitle": "Feature weights updated",
    "detail": "The anti-spam model is being retrained after the latest false-positive review.",
    "status": "ready",
    "flagged": false
  }
];
const summary = "Score high-volume content and account behavior, throttle low-confidence automation, and escalate suspicious spikes for investigation.";
const notes = ["Spam systems need a safe middle ground between observation and irreversible enforcement.","Model drift should show up as queue pressure before it shows up as user harm.","Retraining plans must preserve the labels tied to the original review decision."];

let state: State = {
  primaryIndex: 0,
  secondaryIndex: 0,
  items: structuredClone(baseItems),
  message: "Spam Detection workflow ready."
};

export function getSnapshot(): Snapshot {
  return {
    title: "Spam Detection",
    summary,
    primaryLabel: "model lane",
    secondaryLabel: "enforcement mode",
    primaryValue: primaryValues[state.primaryIndex],
    secondaryValue: secondaryValues[state.secondaryIndex],
    primaryActionLabel: "Advance model lane",
    secondaryActionLabel: "Cycle enforcement mode",
    advanceActionLabel: "Advance selected item",
    items: state.items.map((item) => ({ ...item })),
    notes,
    message: state.message
  };
}

export function applyAction(action: string, itemId?: string) {
  if (action === "cycle-primary") {
    state.primaryIndex = (state.primaryIndex + 1) % primaryValues.length;
    state.message = "Spam Detection" + " moved to " + primaryValues[state.primaryIndex] + ".";
    return;
  }

  if (action === "cycle-secondary") {
    state.secondaryIndex = (state.secondaryIndex + 1) % secondaryValues.length;
    state.message = "Spam Detection" + " switched to " + secondaryValues[state.secondaryIndex] + ".";
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
    state.message = "Advanced " + itemId + " in Spam Detection.";
    return;
  }

  if (action === "reset") {
    state.primaryIndex = 0;
    state.secondaryIndex = 0;
    state.items = structuredClone(baseItems);
    state.message = "Spam Detection workflow reset.";
  }
}
