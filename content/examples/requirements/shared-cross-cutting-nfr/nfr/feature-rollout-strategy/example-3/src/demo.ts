import { z } from "zod";

const PhaseSchema = z.object({
  pct: z.number().min(0).max(100),
  holdMinutes: z.number().int().min(1).max(24 * 60),
});

const PlanSchema = z.object({
  flagKey: z.string(),
  phases: z.array(PhaseSchema).min(1),
  guardrails: z.object({
    maxErrorRate: z.number().min(0).max(1),
    maxP95Ms: z.number().int().min(1),
  }),
});

const plan = PlanSchema.parse({
  flagKey: "new-ui",
  phases: [
    { pct: 1, holdMinutes: 30 },
    { pct: 5, holdMinutes: 30 },
    { pct: 25, holdMinutes: 60 },
    { pct: 50, holdMinutes: 120 },
    { pct: 100, holdMinutes: 0 },
  ],
  guardrails: { maxErrorRate: 0.05, maxP95Ms: 300 },
});

console.log(JSON.stringify(plan, null, 2));

