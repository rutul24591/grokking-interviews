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

const views = ["pre-call lobby", "active call", "reconnect state"];
const modes = ["devices ready", "device missing", "network degraded"];
const baseItems: Item[] = [{"id": "call-1", "title": "Lobby check", "subtitle": "Devices healthy", "status": "ready", "detail": "User can join with the selected mic and camera.", "flagged": false}, {"id": "call-2", "title": "Live meeting", "subtitle": "In-session controls", "status": "active", "detail": "Mute, camera, and network states are healthy.", "flagged": false}, {"id": "call-3", "title": "Recovery banner", "subtitle": "Mic lost mid-call", "status": "recovering", "detail": "User needs fallback controls without leaving the meeting.", "flagged": true}];

let state: State = {
  viewIndex: 0,
  modeIndex: 0,
  items: structuredClone(baseItems),
  message: "Voice Video Calling UI workbench ready."
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
    title: "Voice Video Calling UI",
    primaryLabel: "call stage",
    secondaryLabel: "device posture",
    primaryValue: views[state.viewIndex],
    secondaryValue: modes[state.modeIndex],
    notes: ["Pre-call checks should gate unsafe joins.", "Device loss during a call needs explicit fallback.", "Reconnect paths must stay visible to users."],
    items: state.items.map((item) => ({ ...item })),
    message: state.message
  };
}

export function applyAction(action: string, itemId?: string) {
  if (action === "cycle-primary") {
    state.viewIndex = (state.viewIndex + 1) % views.length;
    state.message = "call stage set to " + views[state.viewIndex] + ".";
    return;
  }

  if (action === "cycle-secondary") {
    state.modeIndex = (state.modeIndex + 1) % modes.length;
    state.message = "device posture set to " + modes[state.modeIndex] + ".";
    return;
  }

  if (action === "advance-selected" && itemId) {
    const statuses = statusesForFamily("security");
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
    state.message = "Advance asset for Voice Video Calling UI.";
    return;
  }

  if (action === "reset") {
    state.viewIndex = 0;
    state.modeIndex = 0;
    state.items = structuredClone(baseItems);
    state.message = "Voice Video Calling UI workbench reset to its default view.";
  }
}
