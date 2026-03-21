import { base64UrlDecode, base64UrlEncode } from "@/lib/base64url";
import { hmacSha256, randomId, timingSafeEqual } from "@/lib/security";
import { getSession, putSession, revokeSession } from "@/lib/store";

const SESSION_COOKIE = "session";

type SigningKey = { kid: string; secret: Uint8Array };

function parseSigningKeys(): { currentKid: string; keys: Map<string, SigningKey> } {
  // Demo-friendly defaults. In production, load from secret manager (and rotate!).
  const raw = process.env.SESSION_SIGNING_KEYS || `k1:${"dev_only_change_me"}`;
  const keys = new Map<string, SigningKey>();
  for (const part of raw.split(",")) {
    const [kid, secret] = part.split(":");
    if (!kid || !secret) continue;
    keys.set(kid, { kid, secret: new TextEncoder().encode(secret) });
  }
  const currentKid = process.env.SESSION_SIGNING_KID || keys.keys().next().value || "k1";
  if (!keys.size) keys.set("k1", { kid: "k1", secret: new TextEncoder().encode("dev_only_change_me") });
  return { currentKid, keys };
}

function nowSec(nowMs = Date.now()): number {
  return Math.floor(nowMs / 1000);
}

function cookieSecureFlag(): boolean {
  return process.env.NODE_ENV === "production";
}

function serializeCookie(name: string, value: string, opts: { maxAgeSec: number }) {
  const parts = [
    `${name}=${value}`,
    "Path=/",
    `Max-Age=${opts.maxAgeSec}`,
    "HttpOnly",
    "SameSite=Lax",
  ];
  if (cookieSecureFlag()) parts.push("Secure");
  return parts.join("; ");
}

function serializeClearCookie(name: string) {
  const parts = [`${name}=`, "Path=/", "Max-Age=0", "HttpOnly", "SameSite=Lax"];
  if (cookieSecureFlag()) parts.push("Secure");
  return parts.join("; ");
}

export function getCookie(req: Request, name: string): string | null {
  const cookie = req.headers.get("cookie");
  if (!cookie) return null;
  const parts = cookie.split(";").map((p) => p.trim());
  for (const p of parts) {
    if (!p) continue;
    const eq = p.indexOf("=");
    if (eq === -1) continue;
    const k = p.slice(0, eq);
    if (k !== name) continue;
    return p.slice(eq + 1);
  }
  return null;
}

export async function createSessionCookie(userId: string) {
  const { currentKid, keys } = parseSigningKeys();
  const key = keys.get(currentKid);
  if (!key) throw new Error("missing signing key");

  const sid = randomId(16);
  const csrfToken = randomId(16);
  const iat = nowSec();
  const exp = iat + 60 * 60; // 1h demo TTL

  putSession({ sid, userId, csrfToken, createdAtMs: Date.now(), expiresAtSec: exp, revokedAtMs: null });

  const payload = { sid, iat, exp };
  const payloadB64 = base64UrlEncode(new TextEncoder().encode(JSON.stringify(payload)));
  const sig = hmacSha256(key.secret, `${key.kid}.${payloadB64}`);
  const token = `${key.kid}.${payloadB64}.${base64UrlEncode(sig)}`;

  return {
    token,
    sid,
    csrfToken,
    setCookie: serializeCookie(SESSION_COOKIE, token, { maxAgeSec: exp - iat }),
  };
}

export function clearSessionCookie() {
  return serializeClearCookie(SESSION_COOKIE);
}

export function logoutSession(req: Request): { setCookie: string } {
  const token = getCookie(req, SESSION_COOKIE);
  if (!token) return { setCookie: serializeClearCookie(SESSION_COOKIE) };
  const verified = verifySessionToken(token);
  if (verified.ok) revokeSession(verified.session.sid);
  return { setCookie: serializeClearCookie(SESSION_COOKIE) };
}

export function verifySessionFromRequest(req: Request):
  | { ok: true; userId: string; csrfToken: string; sid: string }
  | { ok: false; reason: string } {
  const token = getCookie(req, SESSION_COOKIE);
  if (!token) return { ok: false, reason: "missing_session" };
  const verified = verifySessionToken(token);
  if (!verified.ok) return verified;
  const stored = getSession(verified.session.sid);
  if (!stored) return { ok: false, reason: "unknown_session" };
  if (stored.revokedAtMs) return { ok: false, reason: "revoked_session" };
  if (stored.expiresAtSec <= nowSec()) return { ok: false, reason: "expired_session" };
  return { ok: true, userId: stored.userId, csrfToken: stored.csrfToken, sid: stored.sid };
}

export function verifySessionToken(
  token: string,
): { ok: true; session: { sid: string; exp: number } } | { ok: false; reason: string } {
  const parts = token.split(".");
  if (parts.length !== 3) return { ok: false, reason: "bad_token_format" };
  const [kid, payloadB64, sigB64] = parts as [string, string, string];
  const { keys } = parseSigningKeys();
  const key = keys.get(kid);
  if (!key) return { ok: false, reason: "unknown_kid" };
  const expected = hmacSha256(key.secret, `${kid}.${payloadB64}`);
  const actual = base64UrlDecode(sigB64);
  if (!timingSafeEqual(expected, actual)) return { ok: false, reason: "bad_signature" };

  let payload: { sid: string; exp: number } | null = null;
  try {
    payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(payloadB64))) as {
      sid: string;
      exp: number;
    };
  } catch {
    return { ok: false, reason: "bad_payload" };
  }
  if (!payload?.sid || typeof payload.exp !== "number") return { ok: false, reason: "bad_payload" };
  return { ok: true, session: { sid: payload.sid, exp: payload.exp } };
}

