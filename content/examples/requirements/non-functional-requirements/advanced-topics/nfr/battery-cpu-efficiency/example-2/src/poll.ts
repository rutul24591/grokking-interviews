export type PollState = {
  visible: boolean;
  online: boolean;
};

export function nextDelayMs(state: PollState): number {
  if (!state.online) return 30_000;
  if (!state.visible) return 10_000;
  return 1000;
}

export function withJitter(baseMs: number): number {
  const jitter = Math.floor(baseMs * 0.2 * Math.random());
  return baseMs + jitter;
}

