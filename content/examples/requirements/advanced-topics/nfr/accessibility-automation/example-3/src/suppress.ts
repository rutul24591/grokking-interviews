import { createHash } from "node:crypto";
import { z } from "zod";

export const SuppressionSchema = z.object({
  ruleId: z.string().min(1),
  targetHash: z.string().min(1),
  reason: z.string().min(1),
  expiresAt: z.string().min(1),
});

export type Suppression = z.infer<typeof SuppressionSchema>;

export function hashTarget(target: string[]): string {
  return createHash("sha256").update(target.join("|")).digest("hex").slice(0, 16);
}

export function applySuppressions(params: {
  findings: Array<{ ruleId: string; target: string[]; message: string }>;
  suppressions: Suppression[];
}) {
  const suppressionMap = new Map<string, Suppression>();
  for (const s of params.suppressions) suppressionMap.set(`${s.ruleId}:${s.targetHash}`, s);

  const kept = [];
  const suppressed = [];
  for (const f of params.findings) {
    const key = `${f.ruleId}:${hashTarget(f.target)}`;
    const s = suppressionMap.get(key);
    if (s) suppressed.push({ ...f, suppression: s });
    else kept.push(f);
  }

  return { kept, suppressed };
}

