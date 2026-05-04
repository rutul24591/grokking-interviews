export type Event = { id: string; ts: number; kind: string; payload: Record<string, unknown> };

export type DeliveryState = {
  seen: Set<string>; // dedupe window
  lastAckId: string | null;
};

export function shouldApply(state: DeliveryState, e: Event) {
  return !state.seen.has(e.id);
}

export function apply(state: DeliveryState, e: Event) {
  const seen = new Set(state.seen);
  seen.add(e.id);
  // keep window bounded in production
  return { ...state, seen, lastAckId: e.id };
}
