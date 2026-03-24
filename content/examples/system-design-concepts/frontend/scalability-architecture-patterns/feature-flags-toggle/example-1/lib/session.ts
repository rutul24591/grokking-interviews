import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import type { ResponseCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";

const COOKIE_NAME = "ff_session";
const SECRET = process.env.SESSION_SECRET ?? "dev-secret-change-me";

const SessionSchema = z.object({
  v: z.literal(1),
  user: z.object({
    userId: z.string().min(1),
    country: z.enum(["US", "IN", "GB", "DE", "BR"])
  })
});

export type Session = z.infer<typeof SessionSchema>;

function sign(payloadB64: string) {
  return createHmac("sha256", SECRET).update(payloadB64).digest("base64url");
}

function encode(session: Session) {
  const payload = Buffer.from(JSON.stringify(session), "utf-8").toString("base64url");
  const sig = sign(payload);
  return `${payload}.${sig}`;
}

function decode(raw: string): Session | null {
  const [payload, sig] = raw.split(".");
  if (!payload || !sig) return null;

  const expected = sign(payload);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return null;
    if (!timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }

  try {
    const json = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"));
    const parsed = SessionSchema.safeParse(json);
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function readSession(cookieStore: ReadonlyRequestCookies): Session {
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  const parsed = raw ? decode(raw) : null;
  if (parsed) return parsed;

  return { v: 1, user: { userId: "user_123", country: "US" } };
}

export function writeSessionCookie(cookieStore: ResponseCookies, user: Session["user"]) {
  const value = encode({ v: 1, user });
  cookieStore.set(COOKIE_NAME, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/"
  });
}

