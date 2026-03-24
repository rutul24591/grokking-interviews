import { createHash } from "node:crypto";

export function bucketForUser(flagKey: string, userId: string) {
  const digest = createHash("sha256").update(`${flagKey}:${userId}`).digest("hex");
  const slice = digest.slice(0, 13);
  const n = Number.parseInt(slice, 16);
  return n / 0x1fffffffffffff;
}

