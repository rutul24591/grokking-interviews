import { createHash } from "node:crypto";

export function shouldSample(traceId: string, rate: number): boolean {
  if (rate <= 0) return false;
  if (rate >= 1) return true;
  const h = createHash("sha256").update(traceId).digest();
  const n = h.readUInt32BE(0);
  const bucket = n / 0xffffffff;
  return bucket < rate;
}

