export type TargetRule = { percent?: number; userIds?: string[]; countries?: string[] };
export type Rollout = { key: string; enabled: boolean; rules: TargetRule[]; killSwitch: boolean };

export function evaluate(r: Rollout, ctx: { userId: string; country?: string }, rng = Math.random) {
  if (r.killSwitch) return false;
  if (!r.enabled) return false;
  for (const rule of r.rules) {
    if (rule.userIds?.includes(ctx.userId)) return true;
    if (rule.countries?.includes(ctx.country ?? "")) return true;
    if (rule.percent != null && rng() * 100 < rule.percent) return true;
  }
  return false;
}
