export type requestBatchingSystemRuntimeState = {
  topic: "request-batching-system";
  mounted: boolean;
  lastSuccessfulVersion: number;
  pendingVersion: number;
  lastInteractionAtMs: number;
  lastRecoveryAtMs?: number;
  signal: {
    attempt: number;
    deadlineMs: number;
    cacheAgeMs: number;
    conflictCount: number;
  };
};

export type requestBatchingSystemRecoveryPlan = {
  mode: "continue" | "degrade" | "block-and-recover";
  userVisibleState: "current" | "stale-with-banner" | "disabled-with-retry";
  actions: Array<"reuse-inflight-request" | "rollback-optimistic-update" | "retry-with-jitter" | "emit-telemetry" | "keep-current-state">;
  evidence: string[];
};

function minutes(ms: number) {
  return Math.round(ms / 60_000);
}

export function planRequestBatchingSystemRecovery(
  state: requestBatchingSystemRuntimeState,
  nowMs: number,
): requestBatchingSystemRecoveryPlan {
  const evidence: string[] = [];
  const actions: requestBatchingSystemRecoveryPlan["actions"] = ["emit-telemetry"];
  const idleMinutes = minutes(nowMs - state.lastInteractionAtMs);
  const versionGap = state.pendingVersion - state.lastSuccessfulVersion;

  if (!state.mounted) evidence.push("component-unmounted-before-completion");
  if (versionGap > 1) evidence.push("multiple-versions-pending");
  if (idleMinutes > 10) evidence.push("interaction-state-stale:" + idleMinutes + "m");
  if (state.signal.attempt > 2_000) evidence.push("attempt-breached");
  if (state.signal.deadlineMs > 0) evidence.push("deadlineMs-requires-operator-attention");
  if (state.signal.cacheAgeMs > 0.2) evidence.push("cacheAgeMs-unsafe-for-silent-commit");

  if (!state.mounted) {
    actions.push("reuse-inflight-request");
    return { mode: "block-and-recover", userVisibleState: "disabled-with-retry", actions, evidence };
  }

  if (versionGap > 1 || state.signal.cacheAgeMs > 0.2) {
    actions.push("rollback-optimistic-update", "retry-with-jitter");
    return { mode: "degrade", userVisibleState: "stale-with-banner", actions, evidence };
  }

  actions.push("keep-current-state");
  return { mode: "continue", userVisibleState: "current", actions, evidence };
}

export function runRequestBatchingSystemEdgeCaseScenario() {
  const nowMs = Date.parse("2026-05-29T09:15:00.000Z");
  const normal = planRequestBatchingSystemRecovery(
    {
      topic: "request-batching-system",
      mounted: true,
      lastSuccessfulVersion: 21,
      pendingVersion: 22,
      lastInteractionAtMs: nowMs - 90_000,
      signal: { attempt: 160, deadlineMs: 0, cacheAgeMs: 0.01, conflictCount: 0 },
    },
    nowMs,
  );

  const failure = planRequestBatchingSystemRecovery(
    {
      topic: "request-batching-system",
      mounted: true,
      lastSuccessfulVersion: 21,
      pendingVersion: 25,
      lastInteractionAtMs: nowMs - 18 * 60_000,
      signal: { attempt: 2_900, deadlineMs: 2, cacheAgeMs: 0.42, conflictCount: 4 },
    },
    nowMs,
  );

  return {
    topic: "Request Batching System",
    subcategory: "networking-data-systems",
    invariant: "Retries, dedupe, and optimistic updates must be idempotent and observable.",
    normal,
    failure,
  };
}
