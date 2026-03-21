import { stableUniform01 } from "@/lib/random";

export type Variant = "baseline" | "canary";

export function chooseVariant(params: {
  userId: string;
  canaryPct: number;
  salt: string;
}): Variant {
  const pct = Math.max(0, Math.min(100, params.canaryPct));
  if (pct === 0) return "baseline";
  if (pct === 100) return "canary";
  const u = stableUniform01(`${params.salt}:${params.userId}`);
  return u < pct / 100 ? "canary" : "baseline";
}

