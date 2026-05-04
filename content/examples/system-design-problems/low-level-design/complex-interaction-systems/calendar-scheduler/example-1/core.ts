export type EventId = string;
export type CalendarEvent = {
  id: EventId;
  startMs: number;
  endMs: number;
  title: string;
};

export function overlaps(a: CalendarEvent, b: CalendarEvent) {
  return a.startMs < b.endMs && a.endMs > b.startMs;
}

export function findCollisions(events: CalendarEvent[]) {
  const sorted = [...events].sort((a, b) => a.startMs - b.startMs);
  const collisions: Array<[EventId, EventId]> = [];
  for (let i = 0; i < sorted.length; i += 1) {
    for (let j = i + 1; j < sorted.length; j += 1) {
      if (sorted[j].startMs >= sorted[i].endMs) break;
      if (overlaps(sorted[i], sorted[j])) collisions.push([sorted[i].id, sorted[j].id]);
    }
  }
  return collisions;
}

export function clampToDay(ev: CalendarEvent, dayStartMs: number, dayEndMs: number) {
  return {
    ...ev,
    startMs: Math.max(dayStartMs, ev.startMs),
    endMs: Math.min(dayEndMs, ev.endMs),
  };
}
