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

const primaryValues = ["category mute","thread mute","expiration window"];
const secondaryValues = ["until changed","time boxed","surface specific"];
const statuses = ["ready", "active", "recovering", "blocked"] as const;
const baseItems: Item[] = [
  {
    "id": "nm-1",
    "title": "Mute category",
    "subtitle": "Marketing notifications muted",
    "detail": "The user muted one category but still expects important security notifications.",
    "status": "active",
    "flagged": false
  },
  {
    "id": "nm-2",
    "title": "Thread mute",
    "subtitle": "One inbox surface out of sync",
    "detail": "Push notifications honor the mute, but inbox badges still include the thread.",
    "status": "recovering",
    "flagged": true
  },
  {
    "id": "nm-3",
    "title": "Expiration window",
    "subtitle": "Mute end time previewed",
    "detail": "A time-boxed mute shows when notifications will resume.",
    "status": "ready",
    "flagged": false
  }
];
const summary = "Mute notification categories and threads, expose expiration windows, and reconcile mute state across inbox, push, and email.";
const notes = ["Muting must preserve exceptions for legally or operationally required notifications.","Thread and category mutes need clear precedence.","Mute expiry should not surprise the user on resume."];

let state: State = {
  primaryIndex: 0,
  secondaryIndex: 0,
  items: structuredClone(baseItems),
  message: "Notification Muting workflow ready."
};

export function getSnapshot(): Snapshot {
  return {
    title: "Notification Muting",
    summary,
    primaryLabel: "mute view",
    secondaryLabel: "mute mode",
    primaryValue: primaryValues[state.primaryIndex],
    secondaryValue: secondaryValues[state.secondaryIndex],
    primaryActionLabel: "Advance mute view",
    secondaryActionLabel: "Cycle mute mode",
    advanceActionLabel: "Advance selected item",
    items: state.items.map((item) => ({ ...item })),
    notes,
    message: state.message
  };
}

export function applyAction(action: string, itemId?: string) {
  if (action === "cycle-primary") {
    state.primaryIndex = (state.primaryIndex + 1) % primaryValues.length;
    state.message = "Notification Muting" + " moved to " + primaryValues[state.primaryIndex] + ".";
    return;
  }

  if (action === "cycle-secondary") {
    state.secondaryIndex = (state.secondaryIndex + 1) % secondaryValues.length;
    state.message = "Notification Muting" + " switched to " + secondaryValues[state.secondaryIndex] + ".";
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
    state.message = "Advanced " + itemId + " in Notification Muting.";
    return;
  }

  if (action === "reset") {
    state.primaryIndex = 0;
    state.secondaryIndex = 0;
    state.items = structuredClone(baseItems);
    state.message = "Notification Muting workflow reset.";
  }
}
