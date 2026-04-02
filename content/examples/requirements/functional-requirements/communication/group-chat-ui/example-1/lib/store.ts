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

const views = ["public room", "restricted room", "archived room"];
const modes = ["member can post", "read only", "removed member"];
const baseItems: Item[] = [{"id": "group-1", "title": "Community room", "subtitle": "Open membership", "status": "active", "detail": "Room is live with posting enabled.", "flagged": false}, {"id": "group-2", "title": "Incident bridge", "subtitle": "Restricted posters", "status": "ready", "detail": "Only responders can post updates.", "flagged": true}, {"id": "group-3", "title": "Archived room", "subtitle": "History retained", "status": "blocked", "detail": "Messages are frozen pending audit review.", "flagged": true}];

let state: State = {
  viewIndex: 0,
  modeIndex: 0,
  items: structuredClone(baseItems),
  message: "Group Chat UI workbench ready."
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
    title: "Group Chat UI",
    primaryLabel: "room context",
    secondaryLabel: "membership mode",
    primaryValue: views[state.viewIndex],
    secondaryValue: modes[state.modeIndex],
    notes: ["Membership changes should immediately affect posting rights.", "Room-level moderation needs explicit visibility.", "Removed members should not see a broken composer."],
    items: state.items.map((item) => ({ ...item })),
    message: state.message
  };
}

export function applyAction(action: string, itemId?: string) {
  if (action === "cycle-primary") {
    state.viewIndex = (state.viewIndex + 1) % views.length;
    state.message = "room context set to " + views[state.viewIndex] + ".";
    return;
  }

  if (action === "cycle-secondary") {
    state.modeIndex = (state.modeIndex + 1) % modes.length;
    state.message = "membership mode set to " + modes[state.modeIndex] + ".";
    return;
  }

  if (action === "advance-selected" && itemId) {
    const statuses = statusesForFamily("chat");
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
    state.message = "Advance thread for Group Chat UI.";
    return;
  }

  if (action === "reset") {
    state.viewIndex = 0;
    state.modeIndex = 0;
    state.items = structuredClone(baseItems);
    state.message = "Group Chat UI workbench reset to its default view.";
  }
}
