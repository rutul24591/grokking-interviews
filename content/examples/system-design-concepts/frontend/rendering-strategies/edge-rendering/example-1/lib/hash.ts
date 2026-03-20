// Edge-safe deterministic hash (no Node crypto required).
export function fnv1a32(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  // Convert to unsigned 32-bit.
  return hash >>> 0;
}

export function bucketFromUid(uid: string): "A" | "B" {
  return fnv1a32(uid) % 2 === 0 ? "A" : "B";
}

