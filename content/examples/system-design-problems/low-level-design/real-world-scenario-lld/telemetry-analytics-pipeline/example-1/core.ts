export type Event = { id: string; kind: string; at: number; props: Record<string, unknown> };

export function sample(e: Event, rate: number, rng = Math.random) {
  return rng() < rate ? e : null;
}

export function batch(events: Event[], max: number) {
  return { batch: events.slice(0, max), rest: events.slice(max) };
}
