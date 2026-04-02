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

const primaryValues = ["public preview","follower preview","restricted preview"];
const secondaryValues = ["public","followers only","private"];
const statuses = ["ready", "active", "recovering", "blocked"] as const;
const baseItems: Item[] = [
  {
    "id": "vis-1",
    "title": "Public preview",
    "subtitle": "Profile discoverable today",
    "detail": "The current settings expose the profile in search and profile cards.",
    "status": "active",
    "flagged": false
  },
  {
    "id": "vis-2",
    "title": "Field-level restriction",
    "subtitle": "Some fields not honoring scope",
    "detail": "Profile badges are still visible publicly even though the profile moved to followers only.",
    "status": "recovering",
    "flagged": true
  },
  {
    "id": "vis-3",
    "title": "Restricted preview",
    "subtitle": "Hidden-state fallback visible",
    "detail": "The user can preview exactly what a blocked or anonymous viewer would see.",
    "status": "ready",
    "flagged": false
  }
];
const summary = "Control who can see a profile, preview public and follower views, and manage safe fallbacks for hidden or partially hidden fields.";
const notes = ["Visibility settings need audience previews, not just labels.","Field-level visibility leaks are more common than full-profile leaks.","Hidden profiles still need sensible empty-state behavior when linked directly."];

let state: State = {
  primaryIndex: 0,
  secondaryIndex: 0,
  items: structuredClone(baseItems),
  message: "Profile Visibility workflow ready."
};

export function getSnapshot(): Snapshot {
  return {
    title: "Profile Visibility",
    summary,
    primaryLabel: "visibility view",
    secondaryLabel: "visibility level",
    primaryValue: primaryValues[state.primaryIndex],
    secondaryValue: secondaryValues[state.secondaryIndex],
    primaryActionLabel: "Advance visibility view",
    secondaryActionLabel: "Cycle visibility level",
    advanceActionLabel: "Advance selected item",
    items: state.items.map((item) => ({ ...item })),
    notes,
    message: state.message
  };
}

export function applyAction(action: string, itemId?: string) {
  if (action === "cycle-primary") {
    state.primaryIndex = (state.primaryIndex + 1) % primaryValues.length;
    state.message = "Profile Visibility" + " moved to " + primaryValues[state.primaryIndex] + ".";
    return;
  }

  if (action === "cycle-secondary") {
    state.secondaryIndex = (state.secondaryIndex + 1) % secondaryValues.length;
    state.message = "Profile Visibility" + " switched to " + secondaryValues[state.secondaryIndex] + ".";
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
    state.message = "Advanced " + itemId + " in Profile Visibility.";
    return;
  }

  if (action === "reset") {
    state.primaryIndex = 0;
    state.secondaryIndex = 0;
    state.items = structuredClone(baseItems);
    state.message = "Profile Visibility workflow reset.";
  }
}
