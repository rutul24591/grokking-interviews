export type colorPickerRuntimeState = {
  topic: "color-picker";
  mounted: boolean;
  lastSuccessfulVersion: number;
  pendingVersion: number;
  lastInteractionAtMs: number;
  lastRecoveryAtMs?: number;
  signal: {
    invalidFieldCount: number;
    draftAgeMs: number;
    asyncValidationLagMs: number;
    hiddenDirtyFields: number;
  };
};

export type colorPickerRecoveryPlan = {
  mode: "continue" | "degrade" | "block-and-recover";
  userVisibleState: "current" | "stale-with-banner" | "disabled-with-retry";
  actions: Array<"clear-hidden-fields" | "cancel-stale-validation" | "persist-versioned-draft" | "emit-telemetry" | "keep-current-state">;
  evidence: string[];
};

function minutes(ms: number) {
  return Math.round(ms / 60_000);
}

export function planColorPickerRecovery(
  state: colorPickerRuntimeState,
  nowMs: number,
): colorPickerRecoveryPlan {
  const evidence: string[] = [];
  const actions: colorPickerRecoveryPlan["actions"] = ["emit-telemetry"];
  const idleMinutes = minutes(nowMs - state.lastInteractionAtMs);
  const versionGap = state.pendingVersion - state.lastSuccessfulVersion;

  if (!state.mounted) evidence.push("component-unmounted-before-completion");
  if (versionGap > 1) evidence.push("multiple-versions-pending");
  if (idleMinutes > 10) evidence.push("interaction-state-stale:" + idleMinutes + "m");
  if (state.signal.invalidFieldCount > 2_000) evidence.push("invalidFieldCount-breached");
  if (state.signal.draftAgeMs > 0) evidence.push("draftAgeMs-requires-operator-attention");
  if (state.signal.asyncValidationLagMs > 0.2) evidence.push("asyncValidationLagMs-unsafe-for-silent-commit");

  if (!state.mounted) {
    actions.push("clear-hidden-fields");
    return { mode: "block-and-recover", userVisibleState: "disabled-with-retry", actions, evidence };
  }

  if (versionGap > 1 || state.signal.asyncValidationLagMs > 0.2) {
    actions.push("cancel-stale-validation", "persist-versioned-draft");
    return { mode: "degrade", userVisibleState: "stale-with-banner", actions, evidence };
  }

  actions.push("keep-current-state");
  return { mode: "continue", userVisibleState: "current", actions, evidence };
}

export function runColorPickerEdgeCaseScenario() {
  const nowMs = Date.parse("2026-05-29T09:15:00.000Z");
  const normal = planColorPickerRecovery(
    {
      topic: "color-picker",
      mounted: true,
      lastSuccessfulVersion: 21,
      pendingVersion: 22,
      lastInteractionAtMs: nowMs - 90_000,
      signal: { invalidFieldCount: 160, draftAgeMs: 0, asyncValidationLagMs: 0.01, hiddenDirtyFields: 0 },
    },
    nowMs,
  );

  const failure = planColorPickerRecovery(
    {
      topic: "color-picker",
      mounted: true,
      lastSuccessfulVersion: 21,
      pendingVersion: 25,
      lastInteractionAtMs: nowMs - 18 * 60_000,
      signal: { invalidFieldCount: 2_900, draftAgeMs: 2, asyncValidationLagMs: 0.42, hiddenDirtyFields: 4 },
    },
    nowMs,
  );

  return {
    topic: "Color Picker",
    subcategory: "forms-input-systems",
    invariant: "Hidden, async, and restored fields must not submit stale or schema-invalid values.",
    normal,
    failure,
  };
}
