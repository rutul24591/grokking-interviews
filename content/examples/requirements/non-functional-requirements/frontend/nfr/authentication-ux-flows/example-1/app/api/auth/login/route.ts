import { z } from "zod";
import { jsonError, jsonOk, getClientIp } from "@/lib/http";
import { setHttpOnlyCookie, sessionCookieName } from "@/lib/cookies";
import { FixedWindowRateLimiter } from "@/lib/rateLimit";
import { authenticate, createSession } from "@/lib/store";

const BodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const limiter = new FixedWindowRateLimiter({ keyPrefix: "login", windowMs: 60_000, max: 5 });

export async function POST(req: Request) {
  const lim = limiter.consume(getClientIp(req));
  if (!lim.ok) {
    return jsonError(429, "rate_limited", { retryAfterMs: lim.retryAfterMs });
  }

  const ct = req.headers.get("content-type") || "";
  if (!ct.includes("application/json")) return jsonError(415, "unsupported_content_type");
  const body = BodySchema.safeParse(await req.json().catch(() => null));
  if (!body.success) return jsonError(400, "invalid_body");

  const user = await authenticate(body.data.email, body.data.password);
  if (!user) return jsonError(401, "invalid_credentials");

  const session = createSession(user.id);
  const res = jsonOk({ ok: true, user: { id: user.id, email: user.email }, stepUp: { ok: false } });
  res.headers.append("Set-Cookie", setHttpOnlyCookie(sessionCookieName(), session.id, 60 * 60));
  return res;
}

