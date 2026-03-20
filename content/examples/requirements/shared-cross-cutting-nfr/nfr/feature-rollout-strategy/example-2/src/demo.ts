import { createHash } from "node:crypto";

function bucket01(userId: string, salt: string) {
  const h = createHash("sha256").update(`${salt}:${userId}`).digest();
  return h.readUInt32BE(0) / 0xffffffff;
}

function eligible(userId: string, salt: string, pct: number) {
  return bucket01(userId, salt) < pct / 100;
}

for (const pct of [1, 10, 50]) {
  console.log({ pct, user1: eligible("user-1", "v1", pct), user2: eligible("user-2", "v1", pct) });
}

