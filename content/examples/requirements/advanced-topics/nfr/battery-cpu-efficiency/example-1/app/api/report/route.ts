import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";

function percentile(xs: number[], p: number) {
  if (!xs.length) return 0;
  const sorted = xs.slice().sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.floor((sorted.length - 1) * p));
  return sorted[idx];
}

export async function GET() {
  const store = getStore();
  const longtasks = store.telemetry.filter((e) => e.type === "longtask").map((e: any) => e.durationMs as number);
  const polls = store.telemetry.filter((e) => e.type === "poll") as any[];

  const bytesByMode = polls.reduce(
    (acc, p) => {
      acc[p.mode] = (acc[p.mode] ?? 0) + (p.bytes ?? 0);
      acc.total += p.bytes ?? 0;
      if (p.status === 304) acc.notModified += 1;
      if (p.status >= 200 && p.status < 300) acc.ok += 1;
      return acc;
    },
    { total: 0, ok: 0, notModified: 0, naive: 0, optimized: 0 } as Record<string, number>,
  );

  return NextResponse.json({
    ts: new Date().toISOString(),
    longtasks: {
      count: longtasks.length,
      p50: percentile(longtasks, 0.5),
      p95: percentile(longtasks, 0.95),
      max: longtasks.length ? Math.max(...longtasks) : 0,
    },
    polling: {
      totalRequests: polls.length,
      ok: bytesByMode.ok,
      notModified: bytesByMode.notModified,
      bytesTotal: bytesByMode.total,
      bytesByMode: { naive: bytesByMode.naive, optimized: bytesByMode.optimized },
    },
  });
}

