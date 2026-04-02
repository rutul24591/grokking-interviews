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

const views = ["admission", "room fanout", "storm recovery"];
const modes = ["healthy heartbeats", "late heartbeats", "reconnect storm"];
const baseItems: Item[] = [{"id": "ws-1", "title": "Primary connection pool", "subtitle": "Healthy rooms", "status": "active", "detail": "Connections are subscribed and heartbeats are current.", "flagged": false}, {"id": "ws-2", "title": "Late heartbeat pool", "subtitle": "Reconnect risk", "status": "recovering", "detail": "Some clients are nearing timeout.", "flagged": true}, {"id": "ws-3", "title": "Admission pressure", "subtitle": "Storm control", "status": "blocked", "detail": "Reconnect attempts need shed or delay control.", "flagged": true}];

let state: State = {
  viewIndex: 0,
  modeIndex: 0,
  items: structuredClone(baseItems),
  message: "WebSocket Server workbench ready."
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
    title: "WebSocket Server",
    primaryLabel: "connection lane",
    secondaryLabel: "heartbeat posture",
    primaryValue: views[state.viewIndex],
    secondaryValue: modes[state.modeIndex],
    notes: ["Admission should be policy-aware under load.", "Room subscriptions need direct observability.", "Reconnect storms require bounded retry paths."],
    items: state.items.map((item) => ({ ...item })),
    message: state.message
  };
}

export function applyAction(action: string, itemId?: string) {
  if (action === "cycle-primary") {
    state.viewIndex = (state.viewIndex + 1) % views.length;
    state.message = "connection lane set to " + views[state.viewIndex] + ".";
    return;
  }

  if (action === "cycle-secondary") {
    state.modeIndex = (state.modeIndex + 1) % modes.length;
    state.message = "heartbeat posture set to " + modes[state.modeIndex] + ".";
    return;
  }

  if (action === "advance-selected" && itemId) {
    const statuses = statusesForFamily("service");
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
    state.message = "Advance lane for WebSocket Server.";
    return;
  }

  if (action === "reset") {
    state.viewIndex = 0;
    state.modeIndex = 0;
    state.items = structuredClone(baseItems);
    state.message = "WebSocket Server workbench reset to its default view.";
  }
}
