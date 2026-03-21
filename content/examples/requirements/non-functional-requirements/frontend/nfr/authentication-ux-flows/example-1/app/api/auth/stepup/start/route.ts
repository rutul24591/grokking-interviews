import { jsonError, jsonOk } from "@/lib/http";
import { getCookie, sessionCookieName } from "@/lib/cookies";
import { createStepUp, getSession } from "@/lib/store";

export async function POST(req: Request) {
  const sid = getCookie(req, sessionCookieName());
  if (!sid) return jsonError(401, "unauthorized");
  const s = getSession(sid);
  if (!s) return jsonError(401, "unauthorized");

  const ch = createStepUp(s.id);
  // Demo: return the code. In production, deliver via an out-of-band channel (TOTP, push, SMS).
  return jsonOk({ ok: true, challengeId: ch.id, code: ch.code, expiresAtMs: ch.expiresAtMs });
}

