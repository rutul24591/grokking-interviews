import { z } from "zod";
import { jsonError, jsonOk, getClientIp } from "@/lib/http";
import { FixedWindowRateLimiter } from "@/lib/rateLimit";
import { authenticate } from "@/lib/store";
import { createSessionCookie } from "@/lib/session";

const BodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const loginLimiter = new FixedWindowRateLimiter({ keyPrefix: "login", windowMs: 60_000, max: 5 });

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const lim = loginLimiter.consume(ip);
  if (!lim.ok) {
    return jsonError(
      429,
      "rate_limited",
      { retryAfterMs: lim.retryAfterMs },
      { headers: { "Retry-After": String(Math.ceil(lim.retryAfterMs / 1000)) } },
    );
  }

  const ct = req.headers.get("content-type") || "";
  if (!ct.includes("application/json")) return jsonError(415, "unsupported_content_type");

  const body = BodySchema.safeParse(await req.json().catch(() => null));
  if (!body.success) return jsonError(400, "invalid_body");

  const user = await authenticate(body.data.email, body.data.password);
  if (!user) return jsonError(401, "invalid_credentials");

  const session = await createSessionCookie(user.id);
  const res = jsonOk({ user: { id: user.id, email: user.email }, csrfToken: session.csrfToken });
  res.headers.append("Set-Cookie", session.setCookie);
  return res;
}

