export type componentLibrarySystemRuntimeState = {
  topic: "component-library-system";
  mounted: boolean;
  lastSuccessfulVersion: number;
  pendingVersion: number;
  lastInteractionAtMs: number;
  lastRecoveryAtMs?: number;
  signal: {
    latencyMs: number;
    staleAgeMs: number;
    conflictCount: number;
    errorRate: number;
  };
};

export type componentLibrarySystemRecoveryPlan = {
  mode: "continue" | "degrade" | "block-and-recover";
  userVisibleState: "current" | "stale-with-banner" | "disabled-with-retry";
  actions: Array<"show-stale-state" | "queue-repair" | "record-audit-event" | "emit-telemetry" | "keep-current-state">;
  evidence: string[];
};

function minutes(ms: number) {
  return Math.round(ms / 60_000);
}

export function planComponentLibrarySystemRecovery(
  state: componentLibrarySystemRuntimeState,
  nowMs: number,
): componentLibrarySystemRecoveryPlan {
  const evidence: string[] = [];
  const actions: componentLibrarySystemRecoveryPlan["actions"] = ["emit-telemetry"];
  const idleMinutes = minutes(nowMs - state.lastInteractionAtMs);
  const versionGap = state.pendingVersion - state.lastSuccessfulVersion;

  if (!state.mounted) evidence.push("component-unmounted-before-completion");
  if (versionGap > 1) evidence.push("multiple-versions-pending");
  if (idleMinutes > 10) evidence.push("interaction-state-stale:" + idleMinutes + "m");
  if (state.signal.latencyMs > 2_000) evidence.push("latencyMs-breached");
  if (state.signal.staleAgeMs > 0) evidence.push("staleAgeMs-requires-operator-attention");
  if (state.signal.conflictCount > 0.2) evidence.push("conflictCount-unsafe-for-silent-commit");

  if (!state.mounted) {
    actions.push("show-stale-state");
    return { mode: "block-and-recover", userVisibleState: "disabled-with-retry", actions, evidence };
  }

  if (versionGap > 1 || state.signal.conflictCount > 0.2) {
    actions.push("queue-repair", "record-audit-event");
    return { mode: "degrade", userVisibleState: "stale-with-banner", actions, evidence };
  }

  actions.push("keep-current-state");
  return { mode: "continue", userVisibleState: "current", actions, evidence };
}

export function runComponentLibrarySystemEdgeCaseScenario() {
  const nowMs = Date.parse("2026-05-29T09:15:00.000Z");
  const normal = planComponentLibrarySystemRecovery(
    {
      topic: "component-library-system",
      mounted: true,
      lastSuccessfulVersion: 21,
      pendingVersion: 22,
      lastInteractionAtMs: nowMs - 90_000,
      signal: { latencyMs: 160, staleAgeMs: 0, conflictCount: 0.01, errorRate: 0 },
    },
    nowMs,
  );

  const failure = planComponentLibrarySystemRecovery(
    {
      topic: "component-library-system",
      mounted: true,
      lastSuccessfulVersion: 21,
      pendingVersion: 25,
      lastInteractionAtMs: nowMs - 18 * 60_000,
      signal: { latencyMs: 2_900, staleAgeMs: 2, conflictCount: 0.42, errorRate: 4 },
    },
    nowMs,
  );

  return {
    topic: "Component Library System",
    subcategory: "architecture-system-level-lld",
    invariant: "The UI should preserve user intent while exposing stale, failed, or conflicting state clearly.",
    normal,
    failure,
  };
}
