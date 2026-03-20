export type Event = { id: string; ts: number; name: string; props?: Record<string, unknown> };

let events: Event[] = [];

export function recordEvent(e: Event) {
  events = [e, ...events].slice(0, 100);
}

export function analyticsSummary() {
  return { count: events.length, latest: events[0] || null };
}

export function resetAnalytics() {
  events = [];
}

