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

const primaryValues = ["draft readiness","window selection","release execution"];
const secondaryValues = ["author scheduled","campaign aligned","quiet-hours safe"];
const statuses = ["ready", "active", "recovering", "blocked"] as const;
const baseItems: Item[] = [
  {
    "id": "sch-1",
    "title": "Readiness gate",
    "subtitle": "Draft meets basic validation",
    "detail": "The draft is structurally valid but still depends on a media asset that is processing.",
    "status": "active",
    "flagged": false
  },
  {
    "id": "sch-2",
    "title": "Window conflict",
    "subtitle": "Regional quiet hours overlap",
    "detail": "The planned publish window collides with an audience quiet-hours rule in one region.",
    "status": "recovering",
    "flagged": true
  },
  {
    "id": "sch-3",
    "title": "Execution plan",
    "subtitle": "Auto-publish queued",
    "detail": "The release engine holds the content until the chosen time and dependency state align.",
    "status": "ready",
    "flagged": false
  }
];
const summary = "Schedule content changes against release windows, timezone constraints, and dependency readiness before publishing automatically.";
const notes = ["Scheduling is a dependency-management problem as much as a clock problem.","Quiet hours and regional publishing norms need to be visible in the planner.","The system should explain why a schedule cannot execute automatically."];

let state: State = {
  primaryIndex: 0,
  secondaryIndex: 0,
  items: structuredClone(baseItems),
  message: "Content Scheduling workflow ready."
};

export function getSnapshot(): Snapshot {
  return {
    title: "Content Scheduling",
    summary,
    primaryLabel: "schedule stage",
    secondaryLabel: "schedule mode",
    primaryValue: primaryValues[state.primaryIndex],
    secondaryValue: secondaryValues[state.secondaryIndex],
    primaryActionLabel: "Advance schedule stage",
    secondaryActionLabel: "Cycle schedule mode",
    advanceActionLabel: "Advance selected item",
    items: state.items.map((item) => ({ ...item })),
    notes,
    message: state.message
  };
}

export function applyAction(action: string, itemId?: string) {
  if (action === "cycle-primary") {
    state.primaryIndex = (state.primaryIndex + 1) % primaryValues.length;
    state.message = "Content Scheduling" + " moved to " + primaryValues[state.primaryIndex] + ".";
    return;
  }

  if (action === "cycle-secondary") {
    state.secondaryIndex = (state.secondaryIndex + 1) % secondaryValues.length;
    state.message = "Content Scheduling" + " switched to " + secondaryValues[state.secondaryIndex] + ".";
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
    state.message = "Advanced " + itemId + " in Content Scheduling.";
    return;
  }

  if (action === "reset") {
    state.primaryIndex = 0;
    state.secondaryIndex = 0;
    state.items = structuredClone(baseItems);
    state.message = "Content Scheduling workflow reset.";
  }
}
