import { z } from "zod";

export const ChangeSchema = z.object({
  title: z.string(),
  risk: z.enum(["low", "medium", "high", "critical"]),
  emergency: z.boolean(),
  hasRollbackPlan: z.boolean(),
  touchesAuth: z.boolean(),
  regions: z.number().int().min(1),
});

export type Change = z.infer<typeof ChangeSchema>;

export function score(c: Change): number {
  let s = 0;
  s += { low: 1, medium: 3, high: 6, critical: 9 }[c.risk];
  if (!c.hasRollbackPlan) s += 3;
  if (c.touchesAuth) s += 3;
  s += Math.min(5, c.regions - 1);
  if (c.emergency) s += 1; // urgency doesn't reduce risk
  return s;
}

export function requiredApprovals(score: number): number {
  if (score <= 3) return 1;
  if (score <= 7) return 2;
  return 3;
}

