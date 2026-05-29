export type savedViewsFiltersSystemRuntimeState = {
  topic: "saved-views-filters-system";
  mounted: boolean;
  lastSuccessfulVersion: number;
  pendingVersion: number;
  lastInteractionAtMs: number;
  lastRecoveryAtMs?: number;
  signal: {
    rowCount: number;
    cursorDrift: number;
    cacheAgeMs: number;
    renderCostMs: number;
  };
};

export type savedViewsFiltersSystemRecoveryPlan = {
  mode: "continue" | "degrade" | "block-and-recover";
  userVisibleState: "current" | "stale-with-banner" | "disabled-with-retry";
  actions: Array<"preserve-selection" | "rebase-cursor" | "serve-window-cache" | "emit-telemetry" | "keep-current-state">;
  evidence: string[];
};

function minutes(ms: number) {
  return Math.round(ms / 60_000);
}

export function planSavedViewsFiltersSystemRecovery(
  state: savedViewsFiltersSystemRuntimeState,
  nowMs: number,
): savedViewsFiltersSystemRecoveryPlan {
  const evidence: string[] = [];
  const actions: savedViewsFiltersSystemRecoveryPlan["actions"] = ["emit-telemetry"];
  const idleMinutes = minutes(nowMs - state.lastInteractionAtMs);
  const versionGap = state.pendingVersion - state.lastSuccessfulVersion;

  if (!state.mounted) evidence.push("component-unmounted-before-completion");
  if (versionGap > 1) evidence.push("multiple-versions-pending");
  if (idleMinutes > 10) evidence.push("interaction-state-stale:" + idleMinutes + "m");
  if (state.signal.rowCount > 2_000) evidence.push("rowCount-breached");
  if (state.signal.cursorDrift > 0) evidence.push("cursorDrift-requires-operator-attention");
  if (state.signal.cacheAgeMs > 0.2) evidence.push("cacheAgeMs-unsafe-for-silent-commit");

  if (!state.mounted) {
    actions.push("preserve-selection");
    return { mode: "block-and-recover", userVisibleState: "disabled-with-retry", actions, evidence };
  }

  if (versionGap > 1 || state.signal.cacheAgeMs > 0.2) {
    actions.push("rebase-cursor", "serve-window-cache");
    return { mode: "degrade", userVisibleState: "stale-with-banner", actions, evidence };
  }

  actions.push("keep-current-state");
  return { mode: "continue", userVisibleState: "current", actions, evidence };
}

export function runSavedViewsFiltersSystemEdgeCaseScenario() {
  const nowMs = Date.parse("2026-05-29T09:15:00.000Z");
  const normal = planSavedViewsFiltersSystemRecovery(
    {
      topic: "saved-views-filters-system",
      mounted: true,
      lastSuccessfulVersion: 21,
      pendingVersion: 22,
      lastInteractionAtMs: nowMs - 90_000,
      signal: { rowCount: 160, cursorDrift: 0, cacheAgeMs: 0.01, renderCostMs: 0 },
    },
    nowMs,
  );

  const failure = planSavedViewsFiltersSystemRecovery(
    {
      topic: "saved-views-filters-system",
      mounted: true,
      lastSuccessfulVersion: 21,
      pendingVersion: 25,
      lastInteractionAtMs: nowMs - 18 * 60_000,
      signal: { rowCount: 2_900, cursorDrift: 2, cacheAgeMs: 0.42, renderCostMs: 4 },
    },
    nowMs,
  );

  return {
    topic: "Saved Views Filters System",
    subcategory: "data-heavy-ui-components",
    invariant: "Viewport updates must preserve stable identity, cursor order, and visible selection across refreshes.",
    normal,
    failure,
  };
}
