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

const primaryValues = ["feed suppression","notification silence","thread override"];
const secondaryValues = ["personal mute","team-safe mute","temporary snooze"];
const statuses = ["ready", "active", "recovering", "blocked"] as const;
const baseItems: Item[] = [
  {
    "id": "mute-5",
    "title": "Mute rule",
    "subtitle": "Member muted noisy account",
    "detail": "The mute rule hides feed activity without severing the follow graph.",
    "status": "active",
    "flagged": false
  },
  {
    "id": "mute-12",
    "title": "Notification filter",
    "subtitle": "Push suppression not yet synced",
    "detail": "Mute preferences have reached the feed but not the mobile push channel.",
    "status": "recovering",
    "flagged": true
  },
  {
    "id": "mute-16",
    "title": "Thread override",
    "subtitle": "Explicit thread unmute requested",
    "detail": "The user wants one thread unmuted while preserving the broader account mute.",
    "status": "ready",
    "flagged": false
  }
];
const summary = "Apply softer relationship controls than blocking, suppress notifications and content surfaces, and preserve user-level override behavior.";
const notes = ["Muting should be reversible without rehydrating every hidden notification.","Thread-level overrides need precedence rules against account-level muting.","Temporary snooze windows should expire deterministically across devices."];

let state: State = {
  primaryIndex: 0,
  secondaryIndex: 0,
  items: structuredClone(baseItems),
  message: "User Muting workflow ready."
};

export function getSnapshot(): Snapshot {
  return {
    title: "User Muting",
    summary,
    primaryLabel: "mute scope",
    secondaryLabel: "policy mode",
    primaryValue: primaryValues[state.primaryIndex],
    secondaryValue: secondaryValues[state.secondaryIndex],
    primaryActionLabel: "Advance mute scope",
    secondaryActionLabel: "Cycle mute policy",
    advanceActionLabel: "Advance selected item",
    items: state.items.map((item) => ({ ...item })),
    notes,
    message: state.message
  };
}

export function applyAction(action: string, itemId?: string) {
  if (action === "cycle-primary") {
    state.primaryIndex = (state.primaryIndex + 1) % primaryValues.length;
    state.message = "User Muting" + " moved to " + primaryValues[state.primaryIndex] + ".";
    return;
  }

  if (action === "cycle-secondary") {
    state.secondaryIndex = (state.secondaryIndex + 1) % secondaryValues.length;
    state.message = "User Muting" + " switched to " + secondaryValues[state.secondaryIndex] + ".";
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
    state.message = "Advanced " + itemId + " in User Muting.";
    return;
  }

  if (action === "reset") {
    state.primaryIndex = 0;
    state.secondaryIndex = 0;
    state.items = structuredClone(baseItems);
    state.message = "User Muting workflow reset.";
  }
}
