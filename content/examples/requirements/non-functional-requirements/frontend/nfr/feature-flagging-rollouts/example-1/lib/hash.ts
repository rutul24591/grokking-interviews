import crypto from "node:crypto";

export function stableBucket01(input: string): number {
  // Returns [0,1). Stable across processes as long as hashing stays constant.
  const h = crypto.createHash("sha256").update(input).digest();
  const n = h.readUInt32BE(0);
  return n / 2 ** 32;
}

