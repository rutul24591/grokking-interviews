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

const views = ["otp route", "transaction route", "carrier outage"];
const modes = ["primary carrier", "fallback carrier", "rate-limited carrier"];
const baseItems: Item[] = [{"id": "sms-1", "title": "OTP send", "subtitle": "Latency-sensitive", "status": "ready", "detail": "Primary carrier selected for fastest route.", "flagged": false}, {"id": "sms-2", "title": "Transactional send", "subtitle": "Regional policy route", "status": "active", "detail": "Carrier routing depends on recipient region.", "flagged": false}, {"id": "sms-3", "title": "Carrier outage", "subtitle": "Fallback enforced", "status": "blocked", "detail": "Primary carrier is unavailable or rate limited.", "flagged": true}];

let state: State = {
  viewIndex: 0,
  modeIndex: 0,
  items: structuredClone(baseItems),
  message: "SMS Gateways workbench ready."
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
    title: "SMS Gateways",
    primaryLabel: "gateway lane",
    secondaryLabel: "regional posture",
    primaryValue: views[state.viewIndex],
    secondaryValue: modes[state.modeIndex],
    notes: ["Gateway choice should reflect region and urgency.", "Carrier rejection needs explicit fallback.", "Rate limiting should stay visible to operators."],
    items: state.items.map((item) => ({ ...item })),
    message: state.message
  };
}

export function applyAction(action: string, itemId?: string) {
  if (action === "cycle-primary") {
    state.viewIndex = (state.viewIndex + 1) % views.length;
    state.message = "gateway lane set to " + views[state.viewIndex] + ".";
    return;
  }

  if (action === "cycle-secondary") {
    state.modeIndex = (state.modeIndex + 1) % modes.length;
    state.message = "regional posture set to " + modes[state.modeIndex] + ".";
    return;
  }

  if (action === "advance-selected" && itemId) {
    const statuses = statusesForFamily("delivery");
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
    state.message = "Advance delivery for SMS Gateways.";
    return;
  }

  if (action === "reset") {
    state.viewIndex = 0;
    state.modeIndex = 0;
    state.items = structuredClone(baseItems);
    state.message = "SMS Gateways workbench reset to its default view.";
  }
}
