export type secureTokenStorageUxRuntimeState = {
  topic: "secure-token-storage-ux";
  mounted: boolean;
  lastSuccessfulVersion: number;
  pendingVersion: number;
  lastInteractionAtMs: number;
  lastRecoveryAtMs?: number;
  signal: {
    sessionAgeMs: number;
    permissionDrift: number;
    riskScore: number;
    tokenRefreshLagMs: number;
  };
};

export type secureTokenStorageUxRecoveryPlan = {
  mode: "continue" | "degrade" | "block-and-recover";
  userVisibleState: "current" | "stale-with-banner" | "disabled-with-retry";
  actions: Array<"step-up-auth" | "deny-sensitive-action" | "refresh-permissions" | "emit-telemetry" | "keep-current-state">;
  evidence: string[];
};

function minutes(ms: number) {
  return Math.round(ms / 60_000);
}

export function planSecureTokenStorageUxRecovery(
  state: secureTokenStorageUxRuntimeState,
  nowMs: number,
): secureTokenStorageUxRecoveryPlan {
  const evidence: string[] = [];
  const actions: secureTokenStorageUxRecoveryPlan["actions"] = ["emit-telemetry"];
  const idleMinutes = minutes(nowMs - state.lastInteractionAtMs);
  const versionGap = state.pendingVersion - state.lastSuccessfulVersion;

  if (!state.mounted) evidence.push("component-unmounted-before-completion");
  if (versionGap > 1) evidence.push("multiple-versions-pending");
  if (idleMinutes > 10) evidence.push("interaction-state-stale:" + idleMinutes + "m");
  if (state.signal.sessionAgeMs > 2_000) evidence.push("sessionAgeMs-breached");
  if (state.signal.permissionDrift > 0) evidence.push("permissionDrift-requires-operator-attention");
  if (state.signal.riskScore > 0.2) evidence.push("riskScore-unsafe-for-silent-commit");

  if (!state.mounted) {
    actions.push("step-up-auth");
    return { mode: "block-and-recover", userVisibleState: "disabled-with-retry", actions, evidence };
  }

  if (versionGap > 1 || state.signal.riskScore > 0.2) {
    actions.push("deny-sensitive-action", "refresh-permissions");
    return { mode: "degrade", userVisibleState: "stale-with-banner", actions, evidence };
  }

  actions.push("keep-current-state");
  return { mode: "continue", userVisibleState: "current", actions, evidence };
}

export function runSecureTokenStorageUxEdgeCaseScenario() {
  const nowMs = Date.parse("2026-05-29T09:15:00.000Z");
  const normal = planSecureTokenStorageUxRecovery(
    {
      topic: "secure-token-storage-ux",
      mounted: true,
      lastSuccessfulVersion: 21,
      pendingVersion: 22,
      lastInteractionAtMs: nowMs - 90_000,
      signal: { sessionAgeMs: 160, permissionDrift: 0, riskScore: 0.01, tokenRefreshLagMs: 0 },
    },
    nowMs,
  );

  const failure = planSecureTokenStorageUxRecovery(
    {
      topic: "secure-token-storage-ux",
      mounted: true,
      lastSuccessfulVersion: 21,
      pendingVersion: 25,
      lastInteractionAtMs: nowMs - 18 * 60_000,
      signal: { sessionAgeMs: 2_900, permissionDrift: 2, riskScore: 0.42, tokenRefreshLagMs: 4 },
    },
    nowMs,
  );

  return {
    topic: "Secure Token Storage Ux",
    subcategory: "auth-user-systems",
    invariant: "Authorization must fail closed when session, role, or device trust is stale.",
    normal,
    failure,
  };
}
