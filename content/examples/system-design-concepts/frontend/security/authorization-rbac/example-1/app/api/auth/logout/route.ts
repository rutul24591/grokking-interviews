import { cookies } from "next/headers";
import { clearCookieHeader, cookieName, deleteSession, unpackCookie } from "../../../../lib/session";

export async function POST() {
  const raw = (await cookies()).get(cookieName())?.value;
  if (raw) {
    const parsed = unpackCookie(raw);
    if (parsed) deleteSession(parsed.sessionId);
  }
  return Response.json({ ok: true }, { headers: { "Set-Cookie": clearCookieHeader() } });
}

