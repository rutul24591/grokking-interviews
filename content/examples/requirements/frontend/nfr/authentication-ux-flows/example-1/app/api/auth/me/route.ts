import { jsonOk } from "@/lib/http";
import { getCookie, sessionCookieName } from "@/lib/cookies";
import { getSession, stepUpIsFresh } from "@/lib/store";

export async function GET(req: Request) {
  const sid = getCookie(req, sessionCookieName());
  if (!sid) return jsonOk({ user: null, stepUp: { ok: false } });
  const s = getSession(sid);
  if (!s) return jsonOk({ user: null, stepUp: { ok: false } });
  return jsonOk({
    user: { id: s.userId, email: "staff@example.com" },
    stepUp: { ok: stepUpIsFresh(s) },
  });
}

