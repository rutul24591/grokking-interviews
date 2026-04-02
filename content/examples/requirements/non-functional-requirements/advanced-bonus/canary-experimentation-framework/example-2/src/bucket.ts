import { createHash } from "crypto";

export type Variant = "baseline" | "canary";

export function stableUniform01(seed: string) {
  const digest = createHash("sha256").update(seed).digest();
  const bucket = digest.readUInt32BE(0);
  return bucket / 0xffffffff;
}

export function chooseVariant(params: { userId: string; canaryPct: number; salt: string }): Variant {
  const pct = Math.max(0, Math.min(100, params.canaryPct));
  if (pct === 0) return "baseline";
  if (pct === 100) return "canary";
  const u = stableUniform01(`${params.salt}:${params.userId}`);
  return u < pct / 100 ? "canary" : "baseline";
}

