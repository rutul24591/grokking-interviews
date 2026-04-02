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

const views = ["photo send", "video processing", "fallback review"];
const modes = ["upload queued", "transcoding", "manual fallback"];
const baseItems: Item[] = [{"id": "media-1", "title": "Screenshot upload", "subtitle": "Ready preview", "status": "ready", "detail": "Image is staged and ready to send.", "flagged": false}, {"id": "media-2", "title": "Video clip", "subtitle": "Derivative pending", "status": "recovering", "detail": "Transcoding is delayed and user feedback is visible.", "flagged": true}, {"id": "media-3", "title": "Large archive", "subtitle": "Upload blocked", "status": "blocked", "detail": "Attachment exceeded size or type policy.", "flagged": true}];

let state: State = {
  viewIndex: 0,
  modeIndex: 0,
  items: structuredClone(baseItems),
  message: "Media Sharing Chat workbench ready."
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
    title: "Media Sharing Chat",
    primaryLabel: "media queue",
    secondaryLabel: "upload posture",
    primaryValue: views[state.viewIndex],
    secondaryValue: modes[state.modeIndex],
    notes: ["Media should not appear sent before upload succeeds.", "Derivative failures need user-visible recovery.", "Oversized uploads require alternate guidance."],
    items: state.items.map((item) => ({ ...item })),
    message: state.message
  };
}

export function applyAction(action: string, itemId?: string) {
  if (action === "cycle-primary") {
    state.viewIndex = (state.viewIndex + 1) % views.length;
    state.message = "media queue set to " + views[state.viewIndex] + ".";
    return;
  }

  if (action === "cycle-secondary") {
    state.modeIndex = (state.modeIndex + 1) % modes.length;
    state.message = "upload posture set to " + modes[state.modeIndex] + ".";
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
    state.message = "Advance thread for Media Sharing Chat.";
    return;
  }

  if (action === "reset") {
    state.viewIndex = 0;
    state.modeIndex = 0;
    state.items = structuredClone(baseItems);
    state.message = "Media Sharing Chat workbench reset to its default view.";
  }
}
