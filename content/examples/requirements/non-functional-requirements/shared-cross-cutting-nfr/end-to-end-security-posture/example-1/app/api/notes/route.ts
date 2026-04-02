import { z } from "zod";
import { jsonError, jsonOk, getClientIp } from "@/lib/http";
import { FixedWindowRateLimiter } from "@/lib/rateLimit";
import { verifySessionFromRequest } from "@/lib/session";
import { createNote, listNotes } from "@/lib/store";

const CreateSchema = z.object({
  title: z.string().min(1).max(120),
  body: z.string().min(0).max(10_000),
});

const writeLimiter = new FixedWindowRateLimiter({ keyPrefix: "notes_write", windowMs: 60_000, max: 30 });

function enforceCsrf(req: Request, csrfToken: string): string | null {
  const origin = req.headers.get("origin");
  const allowed = new Set((process.env.APP_ORIGINS || "http://localhost:3000").split(",").map((s) => s.trim()));
  if (origin && !allowed.has(origin)) return "bad_origin";

  const secFetch = req.headers.get("sec-fetch-site");
  if (secFetch === "cross-site") return "cross_site";

  const provided = req.headers.get("x-csrf-token");
  if (!provided || provided !== csrfToken) return "bad_csrf";
  return null;
}

export async function GET(req: Request) {
  const s = verifySessionFromRequest(req);
  if (!s.ok) return jsonError(401, "unauthorized", { reason: s.reason });
  return jsonOk({ notes: listNotes(s.userId) });
}

export async function POST(req: Request) {
  const s = verifySessionFromRequest(req);
  if (!s.ok) return jsonError(401, "unauthorized", { reason: s.reason });

  const csrfErr = enforceCsrf(req, s.csrfToken);
  if (csrfErr) return jsonError(403, "csrf", { reason: csrfErr });

  const lim = writeLimiter.consume(`${getClientIp(req)}:${s.userId}`);
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

  const body = CreateSchema.safeParse(await req.json().catch(() => null));
  if (!body.success) return jsonError(400, "invalid_body");

  const note = createNote(s.userId, body.data.title, body.data.body);
  return jsonOk({ ok: true, note });
}

