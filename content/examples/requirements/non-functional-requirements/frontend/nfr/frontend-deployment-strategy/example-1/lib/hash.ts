import crypto from "node:crypto";

export function bucket01(input: string): number {
  const h = crypto.createHash("sha256").update(input).digest();
  return h.readUInt32BE(0) / 2 ** 32;
}

