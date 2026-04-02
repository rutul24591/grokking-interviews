const state = {
  mode: "native" as "native" | "fallback",
  copied: false,
  canonicalUrl: "https://systemdesignprep.dev/articles/feed-ranking?utm_source=share-sheet",
  targets: [
    { id: "sh-1", label: "Copy link", available: true, requiresAuth: false, latency: "instant" },
    { id: "sh-2", label: "Native share", available: true, requiresAuth: false, latency: "fast" },
    { id: "sh-3", label: "Slack", available: false, requiresAuth: true, latency: "degraded" }
  ],
  lastMessage: "Share UIs should keep a reliable copy-link fallback and expose destination readiness before users leave the current reading flow."
};

export function snapshot() { return structuredClone(state); }

export function mutate(type: "switch-mode" | "copy-link") {
  if (type === "switch-mode") {
    state.mode = state.mode === "native" ? "fallback" : "native";
    state.lastMessage = `Switched share UI to ${state.mode} mode. Unavailable destinations remain visible so the fallback path is explicit.`;
    return snapshot();
  }
  state.copied = true;
  state.lastMessage = "Copied canonical share link with campaign parameters.";
  return snapshot();
}
