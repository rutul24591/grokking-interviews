import { z } from "zod";

export const AxeSummarySchema = z.object({
  totalViolations: z.number().int().min(0),
  byImpact: z.record(z.number().int().min(0)),
  violations: z.array(
    z.object({
      id: z.string(),
      impact: z.string().nullable().optional(),
      nodes: z.array(z.object({ target: z.array(z.string()) })).default([]),
    }),
  ),
});

export type AxeSummary = z.infer<typeof AxeSummarySchema>;

const ImpactWeights: Record<string, number> = {
  critical: 10,
  serious: 5,
  moderate: 2,
  minor: 1,
  unknown: 1,
};

export function score(summary: AxeSummary): number {
  let s = 0;
  for (const v of summary.violations) {
    const impact = (v.impact ?? "unknown").toLowerCase();
    s += ImpactWeights[impact] ?? 1;
  }
  return s;
}

export function diffByRule(baseline: AxeSummary, current: AxeSummary) {
  const count = (s: AxeSummary) => {
    const m = new Map<string, number>();
    for (const v of s.violations) m.set(v.id, (m.get(v.id) ?? 0) + 1);
    return m;
  };

  const b = count(baseline);
  const c = count(current);
  const all = new Set([...b.keys(), ...c.keys()]);
  const out: Array<{ ruleId: string; baseline: number; current: number; delta: number }> =
    [];

  for (const ruleId of [...all].sort()) {
    const bv = b.get(ruleId) ?? 0;
    const cv = c.get(ruleId) ?? 0;
    out.push({ ruleId, baseline: bv, current: cv, delta: cv - bv });
  }
  return out;
}

export function assertNoRegression(params: {
  baseline: AxeSummary;
  current: AxeSummary;
  maxScoreDelta: number;
}) {
  const baselineScore = score(params.baseline);
  const currentScore = score(params.current);
  const delta = currentScore - baselineScore;

  return {
    baselineScore,
    currentScore,
    delta,
    ok: delta <= params.maxScoreDelta,
    byRule: diffByRule(params.baseline, params.current),
  };
}

