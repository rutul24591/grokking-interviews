import { jsonError, jsonOk } from "@/lib/http";
import { getCookie, sessionCookieName } from "@/lib/cookies";
import { getSession, stepUpIsFresh } from "@/lib/store";

export async function GET(req: Request) {
  const sid = getCookie(req, sessionCookieName());
  if (!sid) return jsonError(401, "unauthorized");
  const s = getSession(sid);
  if (!s) return jsonError(401, "unauthorized");
  if (!stepUpIsFresh(s)) return jsonError(403, "step_up_required");
  return jsonOk({ ok: true, secret: "sensitive_action_approved" });
}

