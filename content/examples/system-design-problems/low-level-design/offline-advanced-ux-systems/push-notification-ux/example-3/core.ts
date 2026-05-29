export type pushNotificationUxRuntimeState = {
  topic: "push-notification-ux";
  mounted: boolean;
  lastSuccessfulVersion: number;
  pendingVersion: number;
  lastInteractionAtMs: number;
  lastRecoveryAtMs?: number;
  signal: {
    offlineAgeMs: number;
    conflictCount: number;
    logSize: number;
    lastAckVersion: number;
  };
};

export type pushNotificationUxRecoveryPlan = {
  mode: "continue" | "degrade" | "block-and-recover";
  userVisibleState: "current" | "stale-with-banner" | "disabled-with-retry";
  actions: Array<"replay-local-log" | "surface-conflict" | "compact-acknowledged-ops" | "emit-telemetry" | "keep-current-state">;
  evidence: string[];
};

function minutes(ms: number) {
  return Math.round(ms / 60_000);
}

export function planPushNotificationUxRecovery(
  state: pushNotificationUxRuntimeState,
  nowMs: number,
): pushNotificationUxRecoveryPlan {
  const evidence: string[] = [];
  const actions: pushNotificationUxRecoveryPlan["actions"] = ["emit-telemetry"];
  const idleMinutes = minutes(nowMs - state.lastInteractionAtMs);
  const versionGap = state.pendingVersion - state.lastSuccessfulVersion;

  if (!state.mounted) evidence.push("component-unmounted-before-completion");
  if (versionGap > 1) evidence.push("multiple-versions-pending");
  if (idleMinutes > 10) evidence.push("interaction-state-stale:" + idleMinutes + "m");
  if (state.signal.offlineAgeMs > 2_000) evidence.push("offlineAgeMs-breached");
  if (state.signal.conflictCount > 0) evidence.push("conflictCount-requires-operator-attention");
  if (state.signal.logSize > 0.2) evidence.push("logSize-unsafe-for-silent-commit");

  if (!state.mounted) {
    actions.push("replay-local-log");
    return { mode: "block-and-recover", userVisibleState: "disabled-with-retry", actions, evidence };
  }

  if (versionGap > 1 || state.signal.logSize > 0.2) {
    actions.push("surface-conflict", "compact-acknowledged-ops");
    return { mode: "degrade", userVisibleState: "stale-with-banner", actions, evidence };
  }

  actions.push("keep-current-state");
  return { mode: "continue", userVisibleState: "current", actions, evidence };
}

export function runPushNotificationUxEdgeCaseScenario() {
  const nowMs = Date.parse("2026-05-29T09:15:00.000Z");
  const normal = planPushNotificationUxRecovery(
    {
      topic: "push-notification-ux",
      mounted: true,
      lastSuccessfulVersion: 21,
      pendingVersion: 22,
      lastInteractionAtMs: nowMs - 90_000,
      signal: { offlineAgeMs: 160, conflictCount: 0, logSize: 0.01, lastAckVersion: 0 },
    },
    nowMs,
  );

  const failure = planPushNotificationUxRecovery(
    {
      topic: "push-notification-ux",
      mounted: true,
      lastSuccessfulVersion: 21,
      pendingVersion: 25,
      lastInteractionAtMs: nowMs - 18 * 60_000,
      signal: { offlineAgeMs: 2_900, conflictCount: 2, logSize: 0.42, lastAckVersion: 4 },
    },
    nowMs,
  );

  return {
    topic: "Push Notification Ux",
    subcategory: "offline-advanced-ux-systems",
    invariant: "Local state must survive reloads and converge after reconnect without losing user intent.",
    normal,
    failure,
  };
}
