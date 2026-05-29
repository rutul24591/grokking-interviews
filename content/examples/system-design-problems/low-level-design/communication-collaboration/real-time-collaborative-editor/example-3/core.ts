export type realTimeCollaborativeEditorRuntimeState = {
  topic: "real-time-collaborative-editor";
  mounted: boolean;
  lastSuccessfulVersion: number;
  pendingVersion: number;
  lastInteractionAtMs: number;
  lastRecoveryAtMs?: number;
  signal: {
    eventLagMs: number;
    duplicateCount: number;
    presenceAgeMs: number;
    reconnectAttempt: number;
  };
};

export type realTimeCollaborativeEditorRecoveryPlan = {
  mode: "continue" | "degrade" | "block-and-recover";
  userVisibleState: "current" | "stale-with-banner" | "disabled-with-retry";
  actions: Array<"dedupe-event" | "replay-missed-events" | "compact-presence" | "emit-telemetry" | "keep-current-state">;
  evidence: string[];
};

function minutes(ms: number) {
  return Math.round(ms / 60_000);
}

export function planRealTimeCollaborativeEditorRecovery(
  state: realTimeCollaborativeEditorRuntimeState,
  nowMs: number,
): realTimeCollaborativeEditorRecoveryPlan {
  const evidence: string[] = [];
  const actions: realTimeCollaborativeEditorRecoveryPlan["actions"] = ["emit-telemetry"];
  const idleMinutes = minutes(nowMs - state.lastInteractionAtMs);
  const versionGap = state.pendingVersion - state.lastSuccessfulVersion;

  if (!state.mounted) evidence.push("component-unmounted-before-completion");
  if (versionGap > 1) evidence.push("multiple-versions-pending");
  if (idleMinutes > 10) evidence.push("interaction-state-stale:" + idleMinutes + "m");
  if (state.signal.eventLagMs > 2_000) evidence.push("eventLagMs-breached");
  if (state.signal.duplicateCount > 0) evidence.push("duplicateCount-requires-operator-attention");
  if (state.signal.presenceAgeMs > 0.2) evidence.push("presenceAgeMs-unsafe-for-silent-commit");

  if (!state.mounted) {
    actions.push("dedupe-event");
    return { mode: "block-and-recover", userVisibleState: "disabled-with-retry", actions, evidence };
  }

  if (versionGap > 1 || state.signal.presenceAgeMs > 0.2) {
    actions.push("replay-missed-events", "compact-presence");
    return { mode: "degrade", userVisibleState: "stale-with-banner", actions, evidence };
  }

  actions.push("keep-current-state");
  return { mode: "continue", userVisibleState: "current", actions, evidence };
}

export function runRealTimeCollaborativeEditorEdgeCaseScenario() {
  const nowMs = Date.parse("2026-05-29T09:15:00.000Z");
  const normal = planRealTimeCollaborativeEditorRecovery(
    {
      topic: "real-time-collaborative-editor",
      mounted: true,
      lastSuccessfulVersion: 21,
      pendingVersion: 22,
      lastInteractionAtMs: nowMs - 90_000,
      signal: { eventLagMs: 160, duplicateCount: 0, presenceAgeMs: 0.01, reconnectAttempt: 0 },
    },
    nowMs,
  );

  const failure = planRealTimeCollaborativeEditorRecovery(
    {
      topic: "real-time-collaborative-editor",
      mounted: true,
      lastSuccessfulVersion: 21,
      pendingVersion: 25,
      lastInteractionAtMs: nowMs - 18 * 60_000,
      signal: { eventLagMs: 2_900, duplicateCount: 2, presenceAgeMs: 0.42, reconnectAttempt: 4 },
    },
    nowMs,
  );

  return {
    topic: "Real Time Collaborative Editor",
    subcategory: "communication-collaboration",
    invariant: "Late, duplicate, and out-of-order events must not corrupt local room state.",
    normal,
    failure,
  };
}
