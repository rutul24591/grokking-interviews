import { z } from "zod";

const GateInputSchema = z
  .object({
    buildId: z.string().min(1),
    gitSha: z.string().min(7),
    unitTestsPassed: z.boolean(),
    migrationRisk: z.enum(["none", "low", "high"]),
    canaryErrorRate: z.number().min(0).max(1),
    errorBudgetRemaining: z.number().min(0).max(1)
  })
  .strict();

type GateInput = z.infer<typeof GateInputSchema>;

type GateDecision =
  | { promote: true; stage: "staging" | "production" }
  | { promote: false; reason: string };

function decidePromotion(input: GateInput): GateDecision {
  if (!input.unitTestsPassed) return { promote: false, reason: "unit tests failed" };
  if (input.migrationRisk === "high") return { promote: false, reason: "high-risk migration requires approval" };
  if (input.errorBudgetRemaining < 0.15) return { promote: false, reason: "error budget too low to promote" };
  if (input.canaryErrorRate > 0.01) return { promote: false, reason: "canary error rate too high" };
  return { promote: true, stage: "production" };
}

const sample: GateInput = GateInputSchema.parse({
  buildId: "run-1842",
  gitSha: "a1b2c3d4",
  unitTestsPassed: true,
  migrationRisk: "low",
  canaryErrorRate: 0.003,
  errorBudgetRemaining: 0.42
});

console.log(JSON.stringify({ input: sample, decision: decidePromotion(sample) }, null, 2));

