import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "__Host-session";
const SECRET = process.env.SESSION_HMAC_SECRET ?? "dev-secret-change-me";

export function cookieName() {
  return COOKIE_NAME;
}

function sign(sessionId: string) {
  return createHmac("sha256", SECRET).update(sessionId, "utf8").digest("base64url");
}

export function packSessionCookie(sessionId: string) {
  return `${sessionId}.${sign(sessionId)}`;
}

export function unpackSessionCookie(value: string): { sessionId: string } | null {
  const [sessionId, sig] = value.split(".");
  if (!sessionId || !sig) return null;
  const expected = sign(sessionId);
  const a = Buffer.from(sig, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return null;
  if (!timingSafeEqual(a, b)) return null;
  return { sessionId };
}

export function buildSessionSetCookie(value: string) {
  // __Host- rules: Secure + Path=/ + NO Domain.
  const secure = process.env.NODE_ENV === "production";
  return [
    `${COOKIE_NAME}=${value}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    secure ? "Secure" : "",
    "Max-Age=3600"
  ]
    .filter(Boolean)
    .join("; ");
}

export function buildSessionClearCookie() {
  const secure = process.env.NODE_ENV === "production";
  return [
    `${COOKIE_NAME}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    secure ? "Secure" : "",
    "Max-Age=0"
  ]
    .filter(Boolean)
    .join("; ");
}

