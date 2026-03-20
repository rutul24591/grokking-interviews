import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export function mintCsrfSecret(): string {
  return randomBytes(32).toString("hex");
}

export function mintToken(secret: string, sessionId: string): string {
  const nonce = randomBytes(16).toString("hex");
  const msg = `${sessionId}:${nonce}`;
  const sig = createHmac("sha256", secret).update(msg).digest("hex");
  return `${msg}:${sig}`;
}

export function verifyToken(secret: string, token: string, sessionId: string): boolean {
  const parts = token.split(":");
  if (parts.length !== 3) return false;
  const [sid, nonce, sig] = parts;
  if (sid !== sessionId) return false;
  const msg = `${sid}:${nonce}`;
  const expected = createHmac("sha256", secret).update(msg).digest("hex");
  return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}

