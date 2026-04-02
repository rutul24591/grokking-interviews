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

const primaryValues = ["preferred locale","fallback chain","coverage preview"];
const secondaryValues = ["user explicit","browser derived","system fallback"];
const statuses = ["ready", "active", "recovering", "blocked"] as const;
const baseItems: Item[] = [
  {
    "id": "lang-1",
    "title": "Preferred locale",
    "subtitle": "French selected by user",
    "detail": "The locale choice should override browser language and persist across devices.",
    "status": "active",
    "flagged": false
  },
  {
    "id": "lang-2",
    "title": "Fallback chain",
    "subtitle": "One section lacks translation",
    "detail": "An untranslated settings section still falls back to English.",
    "status": "recovering",
    "flagged": true
  },
  {
    "id": "lang-3",
    "title": "Coverage preview",
    "subtitle": "Localized surfaces previewed",
    "detail": "The user can preview where partial localization still exists.",
    "status": "ready",
    "flagged": false
  }
];
const summary = "Persist user language choices, surface fallback behavior, and show where localization coverage still depends on system defaults.";
const notes = ["Language selection should distinguish explicit user intent from browser hints.","Fallback chains need to be visible when localization coverage is incomplete.","Server-rendered and client-rendered locale behavior must remain consistent."];

let state: State = {
  primaryIndex: 0,
  secondaryIndex: 0,
  items: structuredClone(baseItems),
  message: "Language Settings workflow ready."
};

export function getSnapshot(): Snapshot {
  return {
    title: "Language Settings",
    summary,
    primaryLabel: "language view",
    secondaryLabel: "selection mode",
    primaryValue: primaryValues[state.primaryIndex],
    secondaryValue: secondaryValues[state.secondaryIndex],
    primaryActionLabel: "Advance language view",
    secondaryActionLabel: "Cycle selection mode",
    advanceActionLabel: "Advance selected item",
    items: state.items.map((item) => ({ ...item })),
    notes,
    message: state.message
  };
}

export function applyAction(action: string, itemId?: string) {
  if (action === "cycle-primary") {
    state.primaryIndex = (state.primaryIndex + 1) % primaryValues.length;
    state.message = "Language Settings" + " moved to " + primaryValues[state.primaryIndex] + ".";
    return;
  }

  if (action === "cycle-secondary") {
    state.secondaryIndex = (state.secondaryIndex + 1) % secondaryValues.length;
    state.message = "Language Settings" + " switched to " + secondaryValues[state.secondaryIndex] + ".";
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
    state.message = "Advanced " + itemId + " in Language Settings.";
    return;
  }

  if (action === "reset") {
    state.primaryIndex = 0;
    state.secondaryIndex = 0;
    state.items = structuredClone(baseItems);
    state.message = "Language Settings workflow reset.";
  }
}
