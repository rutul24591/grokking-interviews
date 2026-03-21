import { jsonOk } from "@/lib/http";
import { logoutSession } from "@/lib/session";

export async function POST(req: Request) {
  const out = logoutSession(req);
  const res = jsonOk({ ok: true });
  res.headers.append("Set-Cookie", out.setCookie);
  return res;
}

