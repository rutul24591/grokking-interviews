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

const views = ["live feed", "segmented audience", "recovery lane"];
const modes = ["primary broadcaster", "fallback broadcaster", "late joiners"];
const baseItems: Item[] = [{"id": "broadcast-1", "title": "Live room", "subtitle": "Healthy stream", "status": "active", "detail": "Primary broadcaster is feeding the audience.", "flagged": false}, {"id": "broadcast-2", "title": "Regional segment", "subtitle": "Split fanout", "status": "ready", "detail": "Audience is partitioned without changing sequence.", "flagged": false}, {"id": "broadcast-3", "title": "Fallback lane", "subtitle": "Broadcaster degraded", "status": "recovering", "detail": "Backup broadcaster is preparing takeover.", "flagged": true}];

let state: State = {
  viewIndex: 0,
  modeIndex: 0,
  items: structuredClone(baseItems),
  message: "Real-Time Broadcasting workbench ready."
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
    title: "Real-Time Broadcasting",
    primaryLabel: "broadcast lane",
    secondaryLabel: "audience mode",
    primaryValue: views[state.viewIndex],
    secondaryValue: modes[state.modeIndex],
    notes: ["Broadcaster health needs a visible backup path.", "Audience segmentation must preserve ordering.", "Late joiners need deterministic catch-up."],
    items: state.items.map((item) => ({ ...item })),
    message: state.message
  };
}

export function applyAction(action: string, itemId?: string) {
  if (action === "cycle-primary") {
    state.viewIndex = (state.viewIndex + 1) % views.length;
    state.message = "broadcast lane set to " + views[state.viewIndex] + ".";
    return;
  }

  if (action === "cycle-secondary") {
    state.modeIndex = (state.modeIndex + 1) % modes.length;
    state.message = "audience mode set to " + modes[state.modeIndex] + ".";
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
    state.message = "Advance lane for Real-Time Broadcasting.";
    return;
  }

  if (action === "reset") {
    state.viewIndex = 0;
    state.modeIndex = 0;
    state.items = structuredClone(baseItems);
    state.message = "Real-Time Broadcasting workbench reset to its default view.";
  }
}
