const state = {
  profile: "reader" as "reader" | "creator" | "moderator",
  actions: {
    reader: [
      { id: "ia-1", name: "POST /likes", method: "POST", status: "healthy" as const, auth: "session", p95Ms: 42, fallback: "queue retry" },
      { id: "ia-2", name: "POST /bookmarks", method: "POST", status: "healthy" as const, auth: "session", p95Ms: 61, fallback: "local pending-save queue" }
    ],
    creator: [
      { id: "ia-3", name: "POST /comments", method: "POST", status: "healthy" as const, auth: "session + csrf", p95Ms: 94, fallback: "draft queue" },
      { id: "ia-4", name: "POST /share-events", method: "POST", status: "degraded" as const, auth: "session", p95Ms: 230, fallback: "analytics batch" }
    ],
    moderator: [
      { id: "ia-5", name: "POST /flags", method: "POST", status: "healthy" as const, auth: "session + role", p95Ms: 118, fallback: "escalate to moderation queue" },
      { id: "ia-6", name: "POST /interaction-audits", method: "POST", status: "rate-limited" as const, auth: "service token", p95Ms: 310, fallback: "append to audit buffer" }
    ]
  },
  profiles: {
    reader: { writeBudget: "high", idempotency: "user+entity", degradedMode: "queue retry" },
    creator: { writeBudget: "medium", idempotency: "user+entity+surface", degradedMode: "save draft locally" },
    moderator: { writeBudget: "guarded", idempotency: "service+entity+action", degradedMode: "append audit intent" }
  },
  lastMessage: "Interaction APIs should map product actions to auth, latency, idempotency, and fallback behavior so clients can degrade safely."
};

export function snapshot() {
  return structuredClone({
    profile: state.profile,
    actions: state.actions[state.profile],
    profileSummary: state.profiles[state.profile],
    lastMessage: state.lastMessage
  });
}

export function mutate(profile: "reader" | "creator" | "moderator") {
  state.profile = profile;
  state.lastMessage = `Loaded ${profile} interaction API profile with auth, idempotency, and degraded write behavior.`;
  return snapshot();
}
