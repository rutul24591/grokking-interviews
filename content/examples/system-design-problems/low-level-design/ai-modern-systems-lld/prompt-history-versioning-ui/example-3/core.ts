export type promptHistoryVersioningUiRuntimeState = {
  topic: "prompt-history-versioning-ui";
  mounted: boolean;
  lastSuccessfulVersion: number;
  pendingVersion: number;
  lastInteractionAtMs: number;
  lastRecoveryAtMs?: number;
  signal: {
    tokenLatencyMs: number;
    citationCoverage: number;
    retrievalConfidence: number;
    policySeverity: number;
  };
};

export type promptHistoryVersioningUiRecoveryPlan = {
  mode: "continue" | "degrade" | "block-and-recover";
  userVisibleState: "current" | "stale-with-banner" | "disabled-with-retry";
  actions: Array<"abort-stale-stream" | "show-citation-warning" | "fallback-to-keyword-search" | "emit-telemetry" | "keep-current-state">;
  evidence: string[];
};

function minutes(ms: number) {
  return Math.round(ms / 60_000);
}

export function planPromptHistoryVersioningUiRecovery(
  state: promptHistoryVersioningUiRuntimeState,
  nowMs: number,
): promptHistoryVersioningUiRecoveryPlan {
  const evidence: string[] = [];
  const actions: promptHistoryVersioningUiRecoveryPlan["actions"] = ["emit-telemetry"];
  const idleMinutes = minutes(nowMs - state.lastInteractionAtMs);
  const versionGap = state.pendingVersion - state.lastSuccessfulVersion;

  if (!state.mounted) evidence.push("component-unmounted-before-completion");
  if (versionGap > 1) evidence.push("multiple-versions-pending");
  if (idleMinutes > 10) evidence.push("interaction-state-stale:" + idleMinutes + "m");
  if (state.signal.tokenLatencyMs > 2_000) evidence.push("tokenLatencyMs-breached");
  if (state.signal.citationCoverage > 0) evidence.push("citationCoverage-requires-operator-attention");
  if (state.signal.retrievalConfidence > 0.2) evidence.push("retrievalConfidence-unsafe-for-silent-commit");

  if (!state.mounted) {
    actions.push("abort-stale-stream");
    return { mode: "block-and-recover", userVisibleState: "disabled-with-retry", actions, evidence };
  }

  if (versionGap > 1 || state.signal.retrievalConfidence > 0.2) {
    actions.push("show-citation-warning", "fallback-to-keyword-search");
    return { mode: "degrade", userVisibleState: "stale-with-banner", actions, evidence };
  }

  actions.push("keep-current-state");
  return { mode: "continue", userVisibleState: "current", actions, evidence };
}

export function runPromptHistoryVersioningUiEdgeCaseScenario() {
  const nowMs = Date.parse("2026-05-29T09:15:00.000Z");
  const normal = planPromptHistoryVersioningUiRecovery(
    {
      topic: "prompt-history-versioning-ui",
      mounted: true,
      lastSuccessfulVersion: 21,
      pendingVersion: 22,
      lastInteractionAtMs: nowMs - 90_000,
      signal: { tokenLatencyMs: 160, citationCoverage: 0, retrievalConfidence: 0.01, policySeverity: 0 },
    },
    nowMs,
  );

  const failure = planPromptHistoryVersioningUiRecovery(
    {
      topic: "prompt-history-versioning-ui",
      mounted: true,
      lastSuccessfulVersion: 21,
      pendingVersion: 25,
      lastInteractionAtMs: nowMs - 18 * 60_000,
      signal: { tokenLatencyMs: 2_900, citationCoverage: 2, retrievalConfidence: 0.42, policySeverity: 4 },
    },
    nowMs,
  );

  return {
    topic: "Prompt History Versioning UI",
    subcategory: "ai-modern-systems-lld",
    invariant: "Every answer must carry traceable source coverage and stop streaming when the request is superseded.",
    normal,
    failure,
  };
}
