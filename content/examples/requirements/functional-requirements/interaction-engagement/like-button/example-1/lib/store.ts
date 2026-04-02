const state = {
  inlineCount: 128,
  detailCount: 129,
  liked: false,
  mode: "inline" as "inline" | "detail",
  pendingWrite: false,
  lastMessage: "Like buttons should make optimistic state visible without letting count drift across feed and detail surfaces."
};

export function snapshot() {
  return structuredClone(state);
}

export function mutate(type: "toggle-like" | "switch-mode") {
  if (type === "toggle-like") {
    state.liked = !state.liked;
    state.pendingWrite = true;
    state.inlineCount += state.liked ? 1 : -1;
    state.detailCount = state.inlineCount;
    state.lastMessage = `${state.liked ? "Liked" : "Unliked"} item in ${state.mode} mode. Counter reconciliation is pending server acknowledgement.`;
    return snapshot();
  }
  state.mode = state.mode === "inline" ? "detail" : "inline";
  state.pendingWrite = false;
  state.lastMessage = `Switched like button to ${state.mode} mode. Inline and detail counts were reconciled before render.`;
  return snapshot();
}
