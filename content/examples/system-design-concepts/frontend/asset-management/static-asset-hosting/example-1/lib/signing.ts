import crypto from "node:crypto";

export function sign(params: { method: string; path: string; expires: number; secret: string }) {
  const base = `${params.method}\n${params.path}\n${params.expires}`;
  return crypto.createHmac("sha256", params.secret).update(base).digest("base64url");
}

export function timingSafeEqual(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

