export type streamingMarkdownRendererRuntimeState = {
  topic: "streaming-markdown-renderer";
  mounted: boolean;
  lastSuccessfulVersion: number;
  pendingVersion: number;
  lastInteractionAtMs: number;
  lastRecoveryAtMs?: number;
  signal: {
    uploadedBytes: number;
    checksumMismatch: number;
    transcodeLagMs: number;
    retryCount: number;
  };
};

export type streamingMarkdownRendererRecoveryPlan = {
  mode: "continue" | "degrade" | "block-and-recover";
  userVisibleState: "current" | "stale-with-banner" | "disabled-with-retry";
  actions: Array<"resume-from-checkpoint" | "verify-checksum" | "serve-lower-rendition" | "emit-telemetry" | "keep-current-state">;
  evidence: string[];
};

function minutes(ms: number) {
  return Math.round(ms / 60_000);
}

export function planStreamingMarkdownRendererRecovery(
  state: streamingMarkdownRendererRuntimeState,
  nowMs: number,
): streamingMarkdownRendererRecoveryPlan {
  const evidence: string[] = [];
  const actions: streamingMarkdownRendererRecoveryPlan["actions"] = ["emit-telemetry"];
  const idleMinutes = minutes(nowMs - state.lastInteractionAtMs);
  const versionGap = state.pendingVersion - state.lastSuccessfulVersion;

  if (!state.mounted) evidence.push("component-unmounted-before-completion");
  if (versionGap > 1) evidence.push("multiple-versions-pending");
  if (idleMinutes > 10) evidence.push("interaction-state-stale:" + idleMinutes + "m");
  if (state.signal.uploadedBytes > 2_000) evidence.push("uploadedBytes-breached");
  if (state.signal.checksumMismatch > 0) evidence.push("checksumMismatch-requires-operator-attention");
  if (state.signal.transcodeLagMs > 0.2) evidence.push("transcodeLagMs-unsafe-for-silent-commit");

  if (!state.mounted) {
    actions.push("resume-from-checkpoint");
    return { mode: "block-and-recover", userVisibleState: "disabled-with-retry", actions, evidence };
  }

  if (versionGap > 1 || state.signal.transcodeLagMs > 0.2) {
    actions.push("verify-checksum", "serve-lower-rendition");
    return { mode: "degrade", userVisibleState: "stale-with-banner", actions, evidence };
  }

  actions.push("keep-current-state");
  return { mode: "continue", userVisibleState: "current", actions, evidence };
}

export function runStreamingMarkdownRendererEdgeCaseScenario() {
  const nowMs = Date.parse("2026-05-29T09:15:00.000Z");
  const normal = planStreamingMarkdownRendererRecovery(
    {
      topic: "streaming-markdown-renderer",
      mounted: true,
      lastSuccessfulVersion: 21,
      pendingVersion: 22,
      lastInteractionAtMs: nowMs - 90_000,
      signal: { uploadedBytes: 160, checksumMismatch: 0, transcodeLagMs: 0.01, retryCount: 0 },
    },
    nowMs,
  );

  const failure = planStreamingMarkdownRendererRecovery(
    {
      topic: "streaming-markdown-renderer",
      mounted: true,
      lastSuccessfulVersion: 21,
      pendingVersion: 25,
      lastInteractionAtMs: nowMs - 18 * 60_000,
      signal: { uploadedBytes: 2_900, checksumMismatch: 2, transcodeLagMs: 0.42, retryCount: 4 },
    },
    nowMs,
  );

  return {
    topic: "Streaming Markdown Renderer",
    subcategory: "file-media-content-systems",
    invariant: "Large file and media operations must be resumable, verified, and safe to retry.",
    normal,
    failure,
  };
}
