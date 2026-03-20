import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";
import { percentile } from "@/lib/stats";

export async function GET() {
  const store = getStore();
  const ttfb = store.samples.map((s) => s.ttfbMs);
  const longtask = store.samples.map((s) => s.longTaskMs);
  const bytes = store.samples.map((s) => s.bytes);

  const p95 = {
    ttfbMs: percentile(ttfb, 0.95),
    longTaskMs: percentile(longtask, 0.95),
    bytes: percentile(bytes, 0.95),
  };

  const budgets = store.budgets;
  const ok =
    p95.ttfbMs <= budgets.maxP95TtfbMs &&
    p95.longTaskMs <= budgets.maxP95LongTaskMs &&
    p95.bytes <= budgets.maxP95Bytes;

  return NextResponse.json({
    ts: new Date().toISOString(),
    samples: store.samples.length,
    p50: {
      ttfbMs: percentile(ttfb, 0.5),
      longTaskMs: percentile(longtask, 0.5),
      bytes: percentile(bytes, 0.5),
    },
    p95,
    budgets,
    gate: { ok },
  });
}

