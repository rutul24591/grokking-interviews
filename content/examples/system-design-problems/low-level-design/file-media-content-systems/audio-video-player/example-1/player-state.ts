export type PlayerStatus =
  | "idle"
  | "loading"
  | "playing"
  | "paused"
  | "buffering"
  | "ended"
  | "error";

export type Track = { id: string; kind: "captions" | "audio"; label: string; lang?: string };

export type PlayerState = {
  status: PlayerStatus;
  currentTimeMs: number;
  durationMs: number;
  muted: boolean;
  volume: number; // 0..1
  playbackRate: number;
  activeCaptionsTrackId: string | null;
  tracks: Track[];
  error: string | null;
};

export function createPlayer(durationMs: number): PlayerState {
  return {
    status: "idle",
    currentTimeMs: 0,
    durationMs,
    muted: false,
    volume: 1,
    playbackRate: 1,
    activeCaptionsTrackId: null,
    tracks: [],
    error: null,
  };
}

export function play(s: PlayerState) {
  if (s.status === "error") return s;
  return { ...s, status: "playing", error: null };
}

export function pause(s: PlayerState) {
  if (s.status !== "playing" && s.status !== "buffering") return s;
  return { ...s, status: "paused" };
}

export function setTime(s: PlayerState, tMs: number) {
  return { ...s, currentTimeMs: Math.max(0, Math.min(s.durationMs, tMs)) };
}

