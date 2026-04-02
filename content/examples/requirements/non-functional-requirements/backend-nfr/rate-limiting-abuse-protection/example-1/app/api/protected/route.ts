import { limiter } from "@/lib/rateLimiter";
import { jsonError, jsonOk } from "@/lib/http";

function clientIp(req: Request) {
  // In real deployments, rely on trusted proxy headers only.
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
}

export async function GET(req: Request) {
  const apiKey = req.headers.get("x-api-key") || "";
  if (!apiKey) return jsonError(401, "missing_api_key");

  const identity = `${apiKey}:${clientIp(req)}`;
  const decision = limiter.decide(identity);

  if (!decision.allowed) {
    return jsonError(
      429,
      decision.penalty ? "penalty_box" : "rate_limited",
      { retryAfterMs: decision.retryAfterMs },
      { "Retry-After": String(Math.ceil(decision.retryAfterMs / 1000)) }
    );
  }

  return jsonOk(
    { ok: true, data: "protected_value", remaining: decision.remaining },
    {
      headers: {
        "x-ratelimit-remaining": String(decision.remaining),
        "x-ratelimit-reset": String(Date.now() + decision.resetInMs)
      }
    }
  );
}

