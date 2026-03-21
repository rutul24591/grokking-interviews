import { createHash } from "crypto";

export function stableUniform01(seed: string) {
  const digest = createHash("sha256").update(seed).digest();
  const bucket = digest.readUInt32BE(0);
  return bucket / 0xffffffff;
}

