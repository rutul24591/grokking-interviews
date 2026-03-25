import { clearRefreshCookie } from "../../../../lib/cookies";

export async function POST() {
  return Response.json({ ok: true }, { headers: { "Set-Cookie": clearRefreshCookie() } });
}

