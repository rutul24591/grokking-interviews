import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/http";
import { getCookie, sessionCookieName } from "@/lib/cookies";
import { getSession, verifyStepUp } from "@/lib/store";

const BodySchema = z.object({
  challengeId: z.string().min(1),
  code: z.string().min(6).max(6),
});

export async function POST(req: Request) {
  const sid = getCookie(req, sessionCookieName());
  if (!sid) return jsonError(401, "unauthorized");
  const s = getSession(sid);
  if (!s) return jsonError(401, "unauthorized");

  const ct = req.headers.get("content-type") || "";
  if (!ct.includes("application/json")) return jsonError(415, "unsupported_content_type");
  const body = BodySchema.safeParse(await req.json().catch(() => null));
  if (!body.success) return jsonError(400, "invalid_body");

  const ok = verifyStepUp(s.id, body.data.challengeId, body.data.code);
  if (!ok) return jsonError(400, "invalid_or_expired_code");
  return jsonOk({ ok: true });
}

