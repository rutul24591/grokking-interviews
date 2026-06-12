export type AudioVideoPlayerRecoveryInput = {
  operationId: string;
  committedRevision: number;
  observedRevision: number;
  pressure: string;
  retryBudget: number;
};

export type AudioVideoPlayerRecoveryPlan = {
  disposition: "retry" | "degrade" | "manual-review";
  repair: string;
  evidence: string[];
  nextRetryBudget: number;
};

// Recovery is explicit so a UI does not silently corrupt the playback session.
export function planAudioVideoPlayerRecovery(
  input: AudioVideoPlayerRecoveryInput,
): AudioVideoPlayerRecoveryPlan {
  const evidence = [
    `operation:${input.operationId}`,
    `committed:${input.committedRevision}`,
    `observed:${input.observedRevision}`,
    `pressure:${input.pressure}`,
  ];
  if (input.retryBudget <= 0) {
    return {
      disposition: "manual-review",
      repair: "preserve the last committed projection and surface an actionable recovery state",
      evidence,
      nextRetryBudget: 0,
    };
  }
  return {
    disposition: input.observedRevision < input.committedRevision ? "degrade" : "retry",
    repair: "pause decoding, fetch the next bitrate-compatible segment, then resume from the committed playhead",
    evidence,
    nextRetryBudget: input.retryBudget - 1,
  };
}

export function runAudioVideoPlayerRecoveryScenario() {
  return planAudioVideoPlayerRecovery({
    operationId: "audio-video-player-edge-42",
    committedRevision: 12,
    observedRevision: 9,
    pressure: "buffer-ahead dropped below the rebuffer threshold",
    retryBudget: 2,
  });
}
