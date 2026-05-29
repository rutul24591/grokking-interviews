export type intersectionobserverLazySystemRuntimeState = {
  topic: "intersectionobserver-lazy-system";
  mounted: boolean;
  lastSuccessfulVersion: number;
  pendingVersion: number;
  lastInteractionAtMs: number;
  lastRecoveryAtMs?: number;
  signal: {
    permissionDenied: number;
    visibilityAgeMs: number;
    workerQueueDepth: number;
    fallbackCount: number;
  };
};

export type intersectionobserverLazySystemRecoveryPlan = {
  mode: "continue" | "degrade" | "block-and-recover";
  userVisibleState: "current" | "stale-with-banner" | "disabled-with-retry";
  actions: Array<"use-progressive-fallback" | "pause-background-work" | "request-permission-lazily" | "emit-telemetry" | "keep-current-state">;
  evidence: string[];
};

function minutes(ms: number) {
  return Math.round(ms / 60_000);
}

export function planIntersectionobserverLazySystemRecovery(
  state: intersectionobserverLazySystemRuntimeState,
  nowMs: number,
): intersectionobserverLazySystemRecoveryPlan {
  const evidence: string[] = [];
  const actions: intersectionobserverLazySystemRecoveryPlan["actions"] = ["emit-telemetry"];
  const idleMinutes = minutes(nowMs - state.lastInteractionAtMs);
  const versionGap = state.pendingVersion - state.lastSuccessfulVersion;

  if (!state.mounted) evidence.push("component-unmounted-before-completion");
  if (versionGap > 1) evidence.push("multiple-versions-pending");
  if (idleMinutes > 10) evidence.push("interaction-state-stale:" + idleMinutes + "m");
  if (state.signal.permissionDenied > 2_000) evidence.push("permissionDenied-breached");
  if (state.signal.visibilityAgeMs > 0) evidence.push("visibilityAgeMs-requires-operator-attention");
  if (state.signal.workerQueueDepth > 0.2) evidence.push("workerQueueDepth-unsafe-for-silent-commit");

  if (!state.mounted) {
    actions.push("use-progressive-fallback");
    return { mode: "block-and-recover", userVisibleState: "disabled-with-retry", actions, evidence };
  }

  if (versionGap > 1 || state.signal.workerQueueDepth > 0.2) {
    actions.push("pause-background-work", "request-permission-lazily");
    return { mode: "degrade", userVisibleState: "stale-with-banner", actions, evidence };
  }

  actions.push("keep-current-state");
  return { mode: "continue", userVisibleState: "current", actions, evidence };
}

export function runIntersectionobserverLazySystemEdgeCaseScenario() {
  const nowMs = Date.parse("2026-05-29T09:15:00.000Z");
  const normal = planIntersectionobserverLazySystemRecovery(
    {
      topic: "intersectionobserver-lazy-system",
      mounted: true,
      lastSuccessfulVersion: 21,
      pendingVersion: 22,
      lastInteractionAtMs: nowMs - 90_000,
      signal: { permissionDenied: 160, visibilityAgeMs: 0, workerQueueDepth: 0.01, fallbackCount: 0 },
    },
    nowMs,
  );

  const failure = planIntersectionobserverLazySystemRecovery(
    {
      topic: "intersectionobserver-lazy-system",
      mounted: true,
      lastSuccessfulVersion: 21,
      pendingVersion: 25,
      lastInteractionAtMs: nowMs - 18 * 60_000,
      signal: { permissionDenied: 2_900, visibilityAgeMs: 2, workerQueueDepth: 0.42, fallbackCount: 4 },
    },
    nowMs,
  );

  return {
    topic: "Intersectionobserver Lazy System",
    subcategory: "web-platform-browser-apis",
    invariant: "Browser APIs must degrade predictably when permission, lifecycle, or support changes.",
    normal,
    failure,
  };
}
