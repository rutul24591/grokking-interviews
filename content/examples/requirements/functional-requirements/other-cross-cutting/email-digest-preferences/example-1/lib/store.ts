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

const primaryValues = ["cadence settings","topic selection","send preview"];
const secondaryValues = ["immediate","daily digest","weekly digest"];
const statuses = ["ready", "active", "recovering", "blocked"] as const;
const baseItems: Item[] = [
  {
    "id": "dig-1",
    "title": "Cadence setting",
    "subtitle": "Weekly digest currently active",
    "detail": "The user wants high-value summaries without immediate notifications.",
    "status": "active",
    "flagged": false
  },
  {
    "id": "dig-2",
    "title": "Topic scope",
    "subtitle": "A noisy topic remains enabled",
    "detail": "Digest category selection still includes a category the user muted elsewhere.",
    "status": "recovering",
    "flagged": true
  },
  {
    "id": "dig-3",
    "title": "Preview panel",
    "subtitle": "Next digest composition visible",
    "detail": "The next queued digest preview shows which sections will be included.",
    "status": "ready",
    "flagged": false
  }
];
const summary = "Let users pick digest cadence and content scope while previewing the impact on outbound email scheduling.";
const notes = ["Digest preferences need a preview of volume and timing, not just a cadence selector.","Digest scope and mute settings should reconcile before the email job runs.","Fallback rules matter when a digest would otherwise be empty."];

let state: State = {
  primaryIndex: 0,
  secondaryIndex: 0,
  items: structuredClone(baseItems),
  message: "Email Digest Preferences workflow ready."
};

export function getSnapshot(): Snapshot {
  return {
    title: "Email Digest Preferences",
    summary,
    primaryLabel: "digest view",
    secondaryLabel: "delivery mode",
    primaryValue: primaryValues[state.primaryIndex],
    secondaryValue: secondaryValues[state.secondaryIndex],
    primaryActionLabel: "Advance digest view",
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
    state.message = "Email Digest Preferences" + " moved to " + primaryValues[state.primaryIndex] + ".";
    return;
  }

  if (action === "cycle-secondary") {
    state.secondaryIndex = (state.secondaryIndex + 1) % secondaryValues.length;
    state.message = "Email Digest Preferences" + " switched to " + secondaryValues[state.secondaryIndex] + ".";
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
    state.message = "Advanced " + itemId + " in Email Digest Preferences.";
    return;
  }

  if (action === "reset") {
    state.primaryIndex = 0;
    state.secondaryIndex = 0;
    state.items = structuredClone(baseItems);
    state.message = "Email Digest Preferences workflow reset.";
  }
}
