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

const views = ["offer-answer", "candidate exchange", "renegotiation"];
const modes = ["healthy candidates", "delayed candidates", "fallback reconnect"];
const baseItems: Item[] = [{"id": "rtc-1", "title": "Offer-answer flow", "subtitle": "Initial negotiation", "status": "ready", "detail": "Signaling and SDP exchange are prepared.", "flagged": false}, {"id": "rtc-2", "title": "Candidate relay", "subtitle": "Path discovery delayed", "status": "recovering", "detail": "Additional candidates may still establish media.", "flagged": true}, {"id": "rtc-3", "title": "Renegotiation failure", "subtitle": "Fallback path needed", "status": "blocked", "detail": "User needs reconnect guidance without losing context.", "flagged": true}];

let state: State = {
  viewIndex: 0,
  modeIndex: 0,
  items: structuredClone(baseItems),
  message: "WebRTC workbench ready."
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
    title: "WebRTC",
    primaryLabel: "negotiation stage",
    secondaryLabel: "candidate posture",
    primaryValue: views[state.viewIndex],
    secondaryValue: modes[state.modeIndex],
    notes: ["Peer readiness should reflect signaling and ICE progress.", "Late candidates need a bounded fallback path.", "Renegotiation should not destroy a healthy session."],
    items: state.items.map((item) => ({ ...item })),
    message: state.message
  };
}

export function applyAction(action: string, itemId?: string) {
  if (action === "cycle-primary") {
    state.viewIndex = (state.viewIndex + 1) % views.length;
    state.message = "negotiation stage set to " + views[state.viewIndex] + ".";
    return;
  }

  if (action === "cycle-secondary") {
    state.modeIndex = (state.modeIndex + 1) % modes.length;
    state.message = "candidate posture set to " + modes[state.modeIndex] + ".";
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
    state.message = "Advance asset for WebRTC.";
    return;
  }

  if (action === "reset") {
    state.viewIndex = 0;
    state.modeIndex = 0;
    state.items = structuredClone(baseItems);
    state.message = "WebRTC workbench reset to its default view.";
  }
}
