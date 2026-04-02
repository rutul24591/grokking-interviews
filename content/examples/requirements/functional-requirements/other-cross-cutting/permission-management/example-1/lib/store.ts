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

const primaryValues = ["role grants","direct overrides","effective access"];
const secondaryValues = ["role based","direct grant","temporary elevation"];
const statuses = ["ready", "active", "recovering", "blocked"] as const;
const baseItems: Item[] = [
  {
    "id": "perm-1",
    "title": "Role grant",
    "subtitle": "Analyst role assigned",
    "detail": "The user receives a baseline role that unlocks common read operations.",
    "status": "active",
    "flagged": false
  },
  {
    "id": "perm-2",
    "title": "Direct override",
    "subtitle": "One extra permission added",
    "detail": "A direct override adds one permission outside the assigned role pack.",
    "status": "recovering",
    "flagged": true
  },
  {
    "id": "perm-3",
    "title": "Effective access",
    "subtitle": "Drift review pending",
    "detail": "The system compares direct grants, inherited grants, and expiring elevations.",
    "status": "ready",
    "flagged": false
  }
];
const summary = "Assign and revoke permissions, preview effective entitlements, and detect drift between direct grants, roles, and inherited access.";
const notes = ["Permission editors should show effective access, not just raw grants.","Temporary elevation must be distinguishable from standing access.","Drift between role and direct grants is the main operator pain point."];

let state: State = {
  primaryIndex: 0,
  secondaryIndex: 0,
  items: structuredClone(baseItems),
  message: "Permission Management workflow ready."
};

export function getSnapshot(): Snapshot {
  return {
    title: "Permission Management",
    summary,
    primaryLabel: "permission view",
    secondaryLabel: "grant mode",
    primaryValue: primaryValues[state.primaryIndex],
    secondaryValue: secondaryValues[state.secondaryIndex],
    primaryActionLabel: "Advance permission view",
    secondaryActionLabel: "Cycle grant mode",
    advanceActionLabel: "Advance selected item",
    items: state.items.map((item) => ({ ...item })),
    notes,
    message: state.message
  };
}

export function applyAction(action: string, itemId?: string) {
  if (action === "cycle-primary") {
    state.primaryIndex = (state.primaryIndex + 1) % primaryValues.length;
    state.message = "Permission Management" + " moved to " + primaryValues[state.primaryIndex] + ".";
    return;
  }

  if (action === "cycle-secondary") {
    state.secondaryIndex = (state.secondaryIndex + 1) % secondaryValues.length;
    state.message = "Permission Management" + " switched to " + secondaryValues[state.secondaryIndex] + ".";
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
    state.message = "Advanced " + itemId + " in Permission Management.";
    return;
  }

  if (action === "reset") {
    state.primaryIndex = 0;
    state.secondaryIndex = 0;
    state.items = structuredClone(baseItems);
    state.message = "Permission Management workflow reset.";
  }
}
