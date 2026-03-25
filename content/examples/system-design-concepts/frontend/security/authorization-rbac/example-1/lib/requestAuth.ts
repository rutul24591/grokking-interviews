import { cookies } from "next/headers";
import { cookieName, getSession, unpackCookie } from "./session";

export async function getAuth() {
  const raw = (await cookies()).get(cookieName())?.value;
  if (!raw) return { authenticated: false as const };
  const parsed = unpackCookie(raw);
  if (!parsed) return { authenticated: false as const };
  const session = getSession(parsed.sessionId);
  if (!session) return { authenticated: false as const };
  return { authenticated: true as const, session };
}

