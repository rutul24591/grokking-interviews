import { createHash } from "node:crypto";

function score(key: string, shardId: string) {
  const h = createHash("sha256").update(key + ":" + shardId).digest();
  // Use first 8 bytes as a uint64-ish score.
  let v = 0n;
  for (let i = 0; i < 8; i++) v = (v << 8n) + BigInt(h[i]!);
  return v;
}

export function pickShard(key: string, shardIds: string[]) {
  let best = shardIds[0]!;
  let bestScore = score(key, best);
  for (let i = 1; i < shardIds.length; i++) {
    const id = shardIds[i]!;
    const s = score(key, id);
    if (s > bestScore) {
      bestScore = s;
      best = id;
    }
  }
  return best;
}

