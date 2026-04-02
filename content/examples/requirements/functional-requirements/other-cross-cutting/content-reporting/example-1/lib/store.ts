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

const primaryValues = ["report submission","policy investigation","publisher response"];
const secondaryValues = ["community policy","legal escalation","publisher remediation"];
const statuses = ["ready", "active", "recovering", "blocked"] as const;
const baseItems: Item[] = [
  {
    "id": "cr-12",
    "title": "Formal complaint",
    "subtitle": "Publisher-facing report opened",
    "detail": "A formal content complaint now includes jurisdiction, reporter rationale, and target asset references.",
    "status": "ready",
    "flagged": false
  },
  {
    "id": "cr-22",
    "title": "Policy investigation",
    "subtitle": "Legal and policy facts split",
    "detail": "The team is separating defamation, IP, and platform abuse claims before picking the owner channel.",
    "status": "recovering",
    "flagged": true
  },
  {
    "id": "cr-35",
    "title": "Publisher response",
    "subtitle": "Owner remediation pending",
    "detail": "The content owner can revise, appeal, or remove the asset under the current response window.",
    "status": "active",
    "flagged": false
  }
];
const summary = "Handle formal content reports with legal, safety, and community-policy routing before a final owner-visible decision is recorded.";
const notes = ["Formal reports need a clear distinction between policy violations and legal requests.","Publisher notifications should not reveal reporter-sensitive context by default.","Cross-jurisdiction requests need an auditable owner for the final decision."];

let state: State = {
  primaryIndex: 0,
  secondaryIndex: 0,
  items: structuredClone(baseItems),
  message: "Content Reporting workflow ready."
};

export function getSnapshot(): Snapshot {
  return {
    title: "Content Reporting",
    summary,
    primaryLabel: "report lifecycle",
    secondaryLabel: "decision mode",
    primaryValue: primaryValues[state.primaryIndex],
    secondaryValue: secondaryValues[state.secondaryIndex],
    primaryActionLabel: "Advance report lifecycle",
    secondaryActionLabel: "Cycle decision mode",
    advanceActionLabel: "Advance selected item",
    items: state.items.map((item) => ({ ...item })),
    notes,
    message: state.message
  };
}

export function applyAction(action: string, itemId?: string) {
  if (action === "cycle-primary") {
    state.primaryIndex = (state.primaryIndex + 1) % primaryValues.length;
    state.message = "Content Reporting" + " moved to " + primaryValues[state.primaryIndex] + ".";
    return;
  }

  if (action === "cycle-secondary") {
    state.secondaryIndex = (state.secondaryIndex + 1) % secondaryValues.length;
    state.message = "Content Reporting" + " switched to " + secondaryValues[state.secondaryIndex] + ".";
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
    state.message = "Advanced " + itemId + " in Content Reporting.";
    return;
  }

  if (action === "reset") {
    state.primaryIndex = 0;
    state.secondaryIndex = 0;
    state.items = structuredClone(baseItems);
    state.message = "Content Reporting workflow reset.";
  }
}
