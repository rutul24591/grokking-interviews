import type { RumEvent } from "@/lib/rum/types";

const MAX_EVENTS = 2500;

type StoredEvent = RumEvent & {
  _app: string;
  _version: string;
  _ua: string;
};

let buffer: StoredEvent[] = [];

export function resetRumStore() {
  buffer = [];
}

export function addRumEvents(events: RumEvent[], meta: { app: string; version: string; ua: string }) {
  for (const e of events) {
    buffer.push({ ...e, _app: meta.app, _version: meta.version, _ua: meta.ua });
  }
  if (buffer.length > MAX_EVENTS) buffer = buffer.slice(buffer.length - MAX_EVENTS);
  return events.length;
}

function percentile(values: number[], p: number) {
  if (values.length === 0) return undefined;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.max(0, Math.floor((p / 100) * sorted.length)));
  return sorted[idx];
}

export function getRumSummary() {
  const byType: Record<string, number> = {};
  const errorCounts = new Map<string, number>();
  const lcp: number[] = [];

  for (const e of buffer) {
    byType[e.type] = (byType[e.type] || 0) + 1;
    if (e.type === "error") errorCounts.set(e.name, (errorCounts.get(e.name) || 0) + 1);
    if (e.type === "web_vital" && e.name === "lcp" && typeof e.value === "number") lcp.push(e.value);
  }

  const topErrors = [...errorCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({ name, count }));

  return {
    total: buffer.length,
    byType,
    p95: {
      lcp: percentile(lcp, 95),
    },
    topErrors,
  };
}

