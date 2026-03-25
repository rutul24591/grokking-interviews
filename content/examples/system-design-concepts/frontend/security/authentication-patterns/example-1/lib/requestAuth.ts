import { cookies } from "next/headers";
import { unpackSessionCookie, cookieName } from "./sessionCookie";
import { getSession } from "./sessionStore";

export async function getAuth() {
  const raw = (await cookies()).get(cookieName())?.value;
  if (!raw) return { authenticated: false as const };
  const unpacked = unpackSessionCookie(raw);
  if (!unpacked) return { authenticated: false as const };
  const session = getSession(unpacked.sessionId);
  if (!session) return { authenticated: false as const };
  return { authenticated: true as const, session };
}

