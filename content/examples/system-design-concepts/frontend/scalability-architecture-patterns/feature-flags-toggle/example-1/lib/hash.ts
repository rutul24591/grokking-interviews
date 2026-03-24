import { createHash } from "node:crypto";

export function stableFloat01(input: string) {
  const digest = createHash("sha256").update(input).digest("hex");
  // Use 52 bits (safe integer precision for JS numbers).
  const slice = digest.slice(0, 13);
  const n = Number.parseInt(slice, 16);
  return n / 0x1fffffffffffff;
}

