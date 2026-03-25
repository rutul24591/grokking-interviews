import { buildSessionClearCookie, cookieName, unpackSessionCookie } from "../../../../lib/sessionCookie";
import { deleteSession } from "../../../../lib/sessionStore";
import { cookies } from "next/headers";

export async function POST() {
  const raw = (await cookies()).get(cookieName())?.value;
  if (raw) {
    const unpacked = unpackSessionCookie(raw);
    if (unpacked) deleteSession(unpacked.sessionId);
  }

  return Response.json({ ok: true }, { headers: { "Set-Cookie": buildSessionClearCookie() } });
}

