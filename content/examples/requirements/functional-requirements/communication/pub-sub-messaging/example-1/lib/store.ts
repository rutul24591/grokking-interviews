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

const views = ["live subscribers", "lag review", "replay subscribers"];
const modes = ["current", "backlogged", "audit replay"];
const baseItems: Item[] = [{"id": "pubsub-1", "title": "Primary topic", "subtitle": "Healthy subscribers", "status": "active", "detail": "Events are flowing through the live lane.", "flagged": false}, {"id": "pubsub-2", "title": "Lagging consumer", "subtitle": "Offset behind head", "status": "recovering", "detail": "Consumer is replaying missed offsets.", "flagged": true}, {"id": "pubsub-3", "title": "Replay subscriber", "subtitle": "Audit rebuild", "status": "ready", "detail": "Historical replay is isolated from live traffic.", "flagged": false}];

let state: State = {
  viewIndex: 0,
  modeIndex: 0,
  items: structuredClone(baseItems),
  message: "Pub-Sub Messaging workbench ready."
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
    title: "Pub-Sub Messaging",
    primaryLabel: "topic lane",
    secondaryLabel: "subscriber mode",
    primaryValue: views[state.viewIndex],
    secondaryValue: modes[state.modeIndex],
    notes: ["Live and replay consumers should stay isolated.", "Lagging consumers need a visible repair path.", "Replay should not duplicate side effects."],
    items: state.items.map((item) => ({ ...item })),
    message: state.message
  };
}

export function applyAction(action: string, itemId?: string) {
  if (action === "cycle-primary") {
    state.viewIndex = (state.viewIndex + 1) % views.length;
    state.message = "topic lane set to " + views[state.viewIndex] + ".";
    return;
  }

  if (action === "cycle-secondary") {
    state.modeIndex = (state.modeIndex + 1) % modes.length;
    state.message = "subscriber mode set to " + modes[state.modeIndex] + ".";
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
    state.message = "Advance lane for Pub-Sub Messaging.";
    return;
  }

  if (action === "reset") {
    state.viewIndex = 0;
    state.modeIndex = 0;
    state.items = structuredClone(baseItems);
    state.message = "Pub-Sub Messaging workbench reset to its default view.";
  }
}
