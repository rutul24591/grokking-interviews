import { z } from "zod";

export const ExperimentPlanSchema = z.object({
  idempotencyKey: z.string().min(8),
  owner: z.string().min(2),
  env: z.enum(["staging", "prod"]),
  target: z.object({
    service: z.string().min(2),
    region: z.string().min(2),
  }),
  durationMs: z.number().int().min(5_000).max(10 * 60_000),
  blastPct: z.number().min(0).max(100),
  fault: z.discriminatedUnion("type", [
    z.object({ type: z.literal("latency"), latencyMs: z.number().int().min(0).max(10_000) }),
    z.object({ type: z.literal("error"), status: z.number().int().min(400).max(599) }),
    z.object({ type: z.literal("cpu"), burnMs: z.number().int().min(0).max(2_000) }),
  ]),
  approvals: z.array(z.string().min(2)).default([]),
});

export type ExperimentPlan = z.infer<typeof ExperimentPlanSchema>;

export type Policy = {
  allowlistedServicesProd: string[];
  maxProdBlastPct: number;
  maxProdDurationMs: number;
  requiredProdApprovals: string[];
  allowRegions: string[];
};

export type Decision =
  | { allowed: true; normalized: ExperimentPlan }
  | { allowed: false; reasons: string[]; requiredChanges: string[] };

export function evaluatePlan(planInput: unknown, policy: Policy): Decision {
  const parsed = ExperimentPlanSchema.safeParse(planInput);
  if (!parsed.success) {
    return {
      allowed: false,
      reasons: ["schema_invalid"],
      requiredChanges: [parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")],
    };
  }

  const plan = parsed.data;
  const reasons: string[] = [];
  const requiredChanges: string[] = [];

  if (!policy.allowRegions.includes(plan.target.region)) {
    reasons.push("region_not_allowed");
    requiredChanges.push(`Use one of: ${policy.allowRegions.join(", ")}`);
  }

  if (plan.env === "prod") {
    if (!policy.allowlistedServicesProd.includes(plan.target.service)) {
      reasons.push("service_not_allowlisted_for_prod");
      requiredChanges.push(`Allowlist service '${plan.target.service}' or run in staging.`);
    }

    if (plan.blastPct > policy.maxProdBlastPct) {
      reasons.push("blast_radius_too_large");
      requiredChanges.push(`Reduce blastPct to <= ${policy.maxProdBlastPct}.`);
    }

    if (plan.durationMs > policy.maxProdDurationMs) {
      reasons.push("duration_too_long");
      requiredChanges.push(`Reduce durationMs to <= ${policy.maxProdDurationMs}.`);
    }

    for (const required of policy.requiredProdApprovals) {
      if (!plan.approvals.includes(required)) {
        reasons.push("missing_required_approval");
        requiredChanges.push(`Add approval '${required}'.`);
      }
    }
  }

  if (reasons.length > 0) return { allowed: false, reasons, requiredChanges };
  return { allowed: true, normalized: plan };
}

