import { randomUUID, createHmac, timingSafeEqual } from "node:crypto";

const COOKIE = "__Host-session";
const SECRET = process.env.SESSION_HMAC_SECRET ?? "dev-secret-change-me";

export type Session = { sessionId: string; userId: string; username: string; role: string; createdAt: number };
const sessions = new Map<string, Session>();

function sign(sessionId: string) {
  return createHmac("sha256", SECRET).update(sessionId, "utf8").digest("base64url");
}

export function cookieName() {
  return COOKIE;
}

export function createSession(user: { userId: string; username: string; role: string }) {
  const sessionId = randomUUID();
  const s: Session = { sessionId, ...user, createdAt: Date.now() };
  sessions.set(sessionId, s);
  return s;
}

export function deleteSession(sessionId: string) {
  sessions.delete(sessionId);
}

export function getSession(sessionId: string) {
  return sessions.get(sessionId) ?? null;
}

export function packCookie(sessionId: string) {
  return `${sessionId}.${sign(sessionId)}`;
}

export function unpackCookie(value: string) {
  const [sessionId, sig] = value.split(".");
  if (!sessionId || !sig) return null;
  const expected = sign(sessionId);
  const a = Buffer.from(sig, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return { sessionId };
}

export function setCookieHeader(value: string) {
  const secure = process.env.NODE_ENV === "production";
  return [
    `${COOKIE}=${value}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    secure ? "Secure" : "",
    "Max-Age=3600"
  ]
    .filter(Boolean)
    .join("; ");
}

export function clearCookieHeader() {
  const secure = process.env.NODE_ENV === "production";
  return [
    `${COOKIE}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    secure ? "Secure" : "",
    "Max-Age=0"
  ]
    .filter(Boolean)
    .join("; ");
}

