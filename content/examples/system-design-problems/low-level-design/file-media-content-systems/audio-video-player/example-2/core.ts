export type AudioVideoPlayerStage = "idle" | "loading-manifest" | "buffering" | "playing" | "stalled" | "ended";

export type AudioVideoPlayerTransition = {
  command: string;
  from: AudioVideoPlayerStage;
  to: AudioVideoPlayerStage;
  revision: number;
};

export type AudioVideoPlayerState = {
  id: string;
  stage: AudioVideoPlayerStage;
  revision: number;
  audit: string[];
};

// Never advance the playhead beyond the buffered range.
export function applyAudioVideoPlayerTransition(
  state: AudioVideoPlayerState,
  transition: AudioVideoPlayerTransition,
): AudioVideoPlayerState {
  if (transition.revision <= state.revision) return state;
  if (transition.from !== state.stage) {
    throw new Error(`Invalid playback session transition: ${state.stage} -> ${transition.to}`);
  }
  return {
    ...state,
    stage: transition.to,
    revision: transition.revision,
    audit: [...state.audit, `${transition.revision}:${transition.command}`],
  };
}

export function runAudioVideoPlayerProtocolScenario() {
  const transitions: AudioVideoPlayerTransition[] = [
  { command: "load-manifest", from: "idle", to: "loading-manifest", revision: 1 },
  { command: "append-segment", from: "loading-manifest", to: "buffering", revision: 2 },
  { command: "start-playback", from: "buffering", to: "playing", revision: 3 },
  { command: "rebuffer", from: "playing", to: "stalled", revision: 4 },
  { command: "finish", from: "stalled", to: "ended", revision: 5 },
  ];
  return transitions.reduce(applyAudioVideoPlayerTransition, {
    id: "audio-video-player-case-17",
    stage: "idle",
    revision: 0,
    audit: [],
  });
}

export const AudioVideoPlayerInvariant =
  "Never advance the playhead beyond the buffered range.";
