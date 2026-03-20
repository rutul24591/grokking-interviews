import { z } from "zod";

export const ContextSchema = z.object({
  risk: z.enum(["low", "medium", "high", "critical"]),
  emergency: z.boolean(),
  freezeEnabled: z.boolean(),
  approvals: z.number().int().min(0),
});

export type Context = z.infer<typeof ContextSchema>;

export const RuleSchema = z.object({
  name: z.string(),
  when: z
    .object({
      riskIn: z.array(z.enum(["low", "medium", "high", "critical"])).optional(),
      emergency: z.boolean().optional(),
      freezeEnabled: z.boolean().optional(),
      minApprovals: z.number().int().optional(),
    })
    .default({}),
  effect: z.enum(["allow", "deny"]),
  reason: z.string(),
});

export type Rule = z.infer<typeof RuleSchema>;

function matches(ctx: Context, rule: Rule): boolean {
  const w = rule.when;
  if (w.riskIn && !w.riskIn.includes(ctx.risk)) return false;
  if (typeof w.emergency === "boolean" && w.emergency !== ctx.emergency) return false;
  if (typeof w.freezeEnabled === "boolean" && w.freezeEnabled !== ctx.freezeEnabled) return false;
  if (typeof w.minApprovals === "number" && ctx.approvals < w.minApprovals) return false;
  return true;
}

export function evaluate(ctx: Context, rules: Rule[]) {
  for (const r of rules) {
    if (!matches(ctx, r)) continue;
    return { effect: r.effect, rule: r.name, reason: r.reason };
  }
  return { effect: "deny" as const, rule: "default", reason: "No rule matched" };
}

