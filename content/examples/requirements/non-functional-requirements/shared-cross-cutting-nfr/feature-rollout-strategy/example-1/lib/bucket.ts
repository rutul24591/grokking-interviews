import { createHash } from "node:crypto";

export function bucket01(userId: string, salt: string): number {
  const h = createHash("sha256").update(`${salt}:${userId}`).digest();
  const n = h.readUInt32BE(0);
  return n / 0xffffffff;
}

export function inRollout(userId: string, salt: string, pct: number): boolean {
  if (pct <= 0) return false;
  if (pct >= 100) return true;
  return bucket01(userId, salt) < pct / 100;
}

