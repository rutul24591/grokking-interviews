import { NextResponse } from "next/server";
import { getConfig } from "@/lib/store";
import { snapshotRecent, snapshotWindow } from "@/lib/telemetry";
import { budgetSummary, burnRate, evaluateAlerts } from "@/lib/slo";

const WINDOWS: Array<{ label: string; ms: number }> = [
  { label: "5m", ms: 5 * 60 * 1000 },
  { label: "30m", ms: 30 * 60 * 1000 },
  { label: "1h", ms: 60 * 60 * 1000 },
  { label: "6h", ms: 6 * 60 * 60 * 1000 },
  { label: "24h", ms: 24 * 60 * 60 * 1000 },
];

export async function GET() {
  const nowMs = Date.now();
  const config = await getConfig();

  const windowDaysMs = config.slo.windowDays * 24 * 60 * 60 * 1000;
  const budgetCounters = snapshotWindow(nowMs, windowDaysMs);
  const budget = budgetSummary({
    bad: budgetCounters.bad,
    total: budgetCounters.total,
    objective: config.slo.objective,
  });

  const burn = WINDOWS.map((w) => {
    const c = snapshotWindow(nowMs, w.ms);
    const br = burnRate({ bad: c.bad, total: c.total, objective: config.slo.objective });
    const goodRate = c.total === 0 ? 1 : c.good / c.total;
    return {
      windowLabel: w.label,
      windowMs: w.ms,
      total: c.total,
      good: c.good,
      bad: c.bad,
      goodRate,
      errorBudgetAllowedBad: c.total === 0 ? 0 : c.total * (1 - config.slo.objective),
      burnRate: br,
    };
  });

  const burnByLabel = new Map(burn.map((b) => [b.windowLabel, b.burnRate] as const));
  const alerts = evaluateAlerts({
    burn5m: burnByLabel.get("5m") ?? 0,
    burn30m: burnByLabel.get("30m") ?? 0,
    burn1h: burnByLabel.get("1h") ?? 0,
    burn6h: burnByLabel.get("6h") ?? 0,
    remainingBudgetPct: budget.remainingPct,
  });

  const recent = snapshotRecent();

  return NextResponse.json(
    {
      now: new Date(nowMs).toISOString(),
      config,
      rollingBudget: {
        windowLabel: `${config.slo.windowDays}d`,
        total: budgetCounters.total,
        bad: budgetCounters.bad,
        allowedBad: budget.allowedBad,
        remainingBad: budget.remainingBad,
        remainingPct: budget.remainingPct,
        consumedPct: budget.consumedPct,
      },
      burn,
      recent,
      alerts,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}

