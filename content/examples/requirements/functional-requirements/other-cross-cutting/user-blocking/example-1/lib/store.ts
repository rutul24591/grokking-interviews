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

const primaryValues = ["profile access","messaging suppression","graph cleanup"];
const secondaryValues = ["hard block","soft privacy block","appeal review"];
const statuses = ["ready", "active", "recovering", "blocked"] as const;
const baseItems: Item[] = [
  {
    "id": "block-9",
    "title": "Block relationship",
    "subtitle": "Author blocked another member",
    "detail": "The relationship blocks profile views, messaging, and mention suggestions immediately.",
    "status": "active",
    "flagged": false
  },
  {
    "id": "block-17",
    "title": "Downstream cleanup",
    "subtitle": "Search and graph state lagging",
    "detail": "Search caches and follow suggestions still show the blocked account until cleanup finishes.",
    "status": "recovering",
    "flagged": true
  },
  {
    "id": "block-24",
    "title": "Appeal review",
    "subtitle": "Block reversal requested",
    "detail": "A platform-level appeal asks whether one-way or mutual block semantics should change.",
    "status": "ready",
    "flagged": false
  }
];
const summary = "Enforce user-to-user blocking, suppress downstream interactions, and keep block state coherent across messaging, feeds, and search.";
const notes = ["Blocking is directional, but its effects across surfaces are rarely directional.","Search and recommendation caches must converge quickly after a block is created.","Appeal flows need to keep private evidence hidden from the blocked party."];

let state: State = {
  primaryIndex: 0,
  secondaryIndex: 0,
  items: structuredClone(baseItems),
  message: "User Blocking workflow ready."
};

export function getSnapshot(): Snapshot {
  return {
    title: "User Blocking",
    summary,
    primaryLabel: "block scope",
    secondaryLabel: "visibility mode",
    primaryValue: primaryValues[state.primaryIndex],
    secondaryValue: secondaryValues[state.secondaryIndex],
    primaryActionLabel: "Advance block scope",
    secondaryActionLabel: "Cycle visibility mode",
    advanceActionLabel: "Advance selected item",
    items: state.items.map((item) => ({ ...item })),
    notes,
    message: state.message
  };
}

export function applyAction(action: string, itemId?: string) {
  if (action === "cycle-primary") {
    state.primaryIndex = (state.primaryIndex + 1) % primaryValues.length;
    state.message = "User Blocking" + " moved to " + primaryValues[state.primaryIndex] + ".";
    return;
  }

  if (action === "cycle-secondary") {
    state.secondaryIndex = (state.secondaryIndex + 1) % secondaryValues.length;
    state.message = "User Blocking" + " switched to " + secondaryValues[state.secondaryIndex] + ".";
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
    state.message = "Advanced " + itemId + " in User Blocking.";
    return;
  }

  if (action === "reset") {
    state.primaryIndex = 0;
    state.secondaryIndex = 0;
    state.items = structuredClone(baseItems);
    state.message = "User Blocking workflow reset.";
  }
}
