export type Event = { id: string; ts: number; kind: string; summary: string };

export function groupByDay(events: Event[]) {
  const groups: Record<string, Event[]> = {};
  const sorted = [...events].sort((a, b) => b.ts - a.ts);
  for (const e of sorted) {
    const d = new Date(e.ts);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    (groups[key] ??= []).push(e);
  }
  return groups;
}
