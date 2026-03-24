import crypto from "node:crypto";

export function sign(base: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(base).digest("base64url");
}

export function timingSafeEq(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

