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
  primaryLabel: string;
  secondaryLabel: string;
  primaryValue: string;
  secondaryValue: string;
  notes: string[];
  items: Item[];
  message: string;
};

type State = {
  viewIndex: number;
  modeIndex: number;
  items: Item[];
  message: string;
};

const views = ["active now", "idle review", "disconnect cleanup"];
const modes = ["strict timeout", "soft timeout", "forced cleanup"];
const baseItems: Item[] = [{"id": "presence-1", "title": "On-call engineer", "subtitle": "Heartbeat current", "status": "active", "detail": "Recent heartbeat confirms active participation.", "flagged": false}, {"id": "presence-2", "title": "Idle reviewer", "subtitle": "Delayed heartbeat", "status": "recovering", "detail": "May flip to offline under strict timeout.", "flagged": false}, {"id": "presence-3", "title": "Ghost connection", "subtitle": "Disconnect missing", "status": "blocked", "detail": "Needs forced cleanup to avoid stale presence.", "flagged": true}];

let state: State = {
  viewIndex: 0,
  modeIndex: 0,
  items: structuredClone(baseItems),
  message: "Presence Indicators workbench ready."
};

function statusesForFamily(kind: string) {
  if (kind === "chat") return ["ready", "active", "recovering", "blocked"];
  if (kind === "delivery") return ["ready", "sending", "recovering", "blocked"];
  if (kind === "service") return ["ready", "active", "recovering", "blocked"];
  if (kind === "experience") return ["ready", "active", "recovering", "blocked"];
  return ["ready", "active", "recovering", "blocked"];
}

export function getSnapshot(): Snapshot {
  return {
    title: "Presence Indicators",
    primaryLabel: "presence view",
    secondaryLabel: "heartbeat policy",
    primaryValue: views[state.viewIndex],
    secondaryValue: modes[state.modeIndex],
    notes: ["Presence must degrade cleanly under delayed heartbeats.", "Ghost sessions need a detectable cleanup path.", "Last seen should remain monotonic."],
    items: state.items.map((item) => ({ ...item })),
    message: state.message
  };
}

export function applyAction(action: string, itemId?: string) {
  if (action === "cycle-primary") {
    state.viewIndex = (state.viewIndex + 1) % views.length;
    state.message = "presence view set to " + views[state.viewIndex] + ".";
    return;
  }

  if (action === "cycle-secondary") {
    state.modeIndex = (state.modeIndex + 1) % modes.length;
    state.message = "heartbeat policy set to " + modes[state.modeIndex] + ".";
    return;
  }

  if (action === "advance-selected" && itemId) {
    const statuses = statusesForFamily("experience");
    state.items = state.items.map((item) => {
      if (item.id !== itemId) return item;
      const nextStatus = statuses[(statuses.indexOf(item.status) + 1) % statuses.length];
      return {
        ...item,
        status: nextStatus,
        flagged: nextStatus === "recovering" || nextStatus === "blocked",
        detail: item.title + " moved into " + nextStatus + " state for the current workflow."
      };
    });
    state.message = "Advance state for Presence Indicators.";
    return;
  }

  if (action === "reset") {
    state.viewIndex = 0;
    state.modeIndex = 0;
    state.items = structuredClone(baseItems);
    state.message = "Presence Indicators workbench reset to its default view.";
  }
}
