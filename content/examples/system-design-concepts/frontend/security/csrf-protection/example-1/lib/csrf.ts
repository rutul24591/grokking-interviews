import { timingSafeEqual } from "node:crypto";

export function isAllowedOrigin(req: Request) {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (!origin || !host) return false;

  // In production you should enforce the expected scheme (https) and explicit allowlists.
  return origin === `http://${host}` || origin === `https://${host}`;
}

export function timingSafeEquals(a: string, b: string) {
  const ba = Buffer.from(a, "utf-8");
  const bb = Buffer.from(b, "utf-8");
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

