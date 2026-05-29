export type dragDropListRuntimeState = {
  topic: "drag-drop-list";
  mounted: boolean;
  lastSuccessfulVersion: number;
  pendingVersion: number;
  lastInteractionAtMs: number;
  lastRecoveryAtMs?: number;
  signal: {
    frameCostMs: number;
    focusDrift: number;
    layoutShiftPx: number;
    pointerCancelCount: number;
  };
};

export type dragDropListRecoveryPlan = {
  mode: "continue" | "degrade" | "block-and-recover";
  userVisibleState: "current" | "stale-with-banner" | "disabled-with-retry";
  actions: Array<"restore-focus" | "clamp-layout" | "defer-expensive-work" | "emit-telemetry" | "keep-current-state">;
  evidence: string[];
};

function minutes(ms: number) {
  return Math.round(ms / 60_000);
}

export function planDragDropListRecovery(
  state: dragDropListRuntimeState,
  nowMs: number,
): dragDropListRecoveryPlan {
  const evidence: string[] = [];
  const actions: dragDropListRecoveryPlan["actions"] = ["emit-telemetry"];
  const idleMinutes = minutes(nowMs - state.lastInteractionAtMs);
  const versionGap = state.pendingVersion - state.lastSuccessfulVersion;

  if (!state.mounted) evidence.push("component-unmounted-before-completion");
  if (versionGap > 1) evidence.push("multiple-versions-pending");
  if (idleMinutes > 10) evidence.push("interaction-state-stale:" + idleMinutes + "m");
  if (state.signal.frameCostMs > 2_000) evidence.push("frameCostMs-breached");
  if (state.signal.focusDrift > 0) evidence.push("focusDrift-requires-operator-attention");
  if (state.signal.layoutShiftPx > 0.2) evidence.push("layoutShiftPx-unsafe-for-silent-commit");

  if (!state.mounted) {
    actions.push("restore-focus");
    return { mode: "block-and-recover", userVisibleState: "disabled-with-retry", actions, evidence };
  }

  if (versionGap > 1 || state.signal.layoutShiftPx > 0.2) {
    actions.push("clamp-layout", "defer-expensive-work");
    return { mode: "degrade", userVisibleState: "stale-with-banner", actions, evidence };
  }

  actions.push("keep-current-state");
  return { mode: "continue", userVisibleState: "current", actions, evidence };
}

export function runDragDropListEdgeCaseScenario() {
  const nowMs = Date.parse("2026-05-29T09:15:00.000Z");
  const normal = planDragDropListRecovery(
    {
      topic: "drag-drop-list",
      mounted: true,
      lastSuccessfulVersion: 21,
      pendingVersion: 22,
      lastInteractionAtMs: nowMs - 90_000,
      signal: { frameCostMs: 160, focusDrift: 0, layoutShiftPx: 0.01, pointerCancelCount: 0 },
    },
    nowMs,
  );

  const failure = planDragDropListRecovery(
    {
      topic: "drag-drop-list",
      mounted: true,
      lastSuccessfulVersion: 21,
      pendingVersion: 25,
      lastInteractionAtMs: nowMs - 18 * 60_000,
      signal: { frameCostMs: 2_900, focusDrift: 2, layoutShiftPx: 0.42, pointerCancelCount: 4 },
    },
    nowMs,
  );

  return {
    topic: "Drag Drop List",
    subcategory: "complex-interaction-systems",
    invariant: "Keyboard, pointer, and assistive-technology paths must converge on the same committed state.",
    normal,
    failure,
  };
}
