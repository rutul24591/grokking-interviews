import { LatencyBudget } from "@/lib/latencyBudget";
import { jsonOk } from "@/lib/http";
import { NextResponse } from "next/server";
import { z } from "zod";

const QuerySchema = z.object({
  mode: z.enum(["fast", "slow"]).default("fast"),
  slaMs: z.coerce.number().int().positive().max(2000).default(250)
});

async function fakeDb(mode: "fast" | "slow") {
  const ms = mode === "fast" ? 60 : 320;
  await new Promise((r) => setTimeout(r, ms));
  return { posts: [{ id: "p1", title: "Hello" }], source: "db" as const };
}

async function fakeCache() {
  await new Promise((r) => setTimeout(r, 15));
  return { posts: [{ id: "p1", title: "Hello" }], source: "cache" as const };
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = QuerySchema.safeParse({
    mode: url.searchParams.get("mode") ?? "fast",
    slaMs: url.searchParams.get("slaMs") ?? "250"
  });
  if (!parsed.success) return NextResponse.json({ error: "invalid_query", details: parsed.error.issues }, { status: 400 });

  const budget = new LatencyBudget(parsed.data.slaMs);

  await budget.sleep("auth", 25);

  const cache = await budget.time("cache", () => fakeCache(), { estimateMs: 20 });

  const db = await budget.time("db", () => fakeDb(parsed.data.mode), { estimateMs: parsed.data.mode === "fast" ? 80 : 350 });

  const data = db.skipped
    ? { ...cache.value, source: "cache", degraded: true }
    : { ...db.value, degraded: false };

  const report = budget.report();
  const serverTiming = report.timings
    .map((t) => `${t.step};dur=${t.ms}${t.skipped ? ";desc=skipped" : ""}`)
    .join(", ");

  return jsonOk(
    {
      ok: true,
      mode: parsed.data.mode,
      degraded: data.degraded,
      data,
      report
    },
    { headers: { "Server-Timing": serverTiming } }
  );
}

