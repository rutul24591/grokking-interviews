import { jsonOk } from "@/lib/http";
import { clearHttpOnlyCookie, getCookie, sessionCookieName } from "@/lib/cookies";
import { deleteSession } from "@/lib/store";

export async function POST(req: Request) {
  const sid = getCookie(req, sessionCookieName());
  if (sid) deleteSession(sid);
  const res = jsonOk({ ok: true });
  res.headers.append("Set-Cookie", clearHttpOnlyCookie(sessionCookieName()));
  return res;
}

