import { z } from "zod";
import { authenticate } from "../../../../lib/users";
import { createSession, packCookie, setCookieHeader } from "../../../../lib/session";

const bodySchema = z.object({ username: z.string().min(1), password: z.string().min(1) });

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) return Response.json({ error: "invalid input" }, { status: 400 });

  const user = authenticate(parsed.data.username, parsed.data.password);
  if (!user) return Response.json({ error: "invalid credentials" }, { status: 401 });

  const session = createSession(user);
  const cookie = packCookie(session.sessionId);
  return Response.json(
    { ok: true, user },
    { headers: { "Set-Cookie": setCookieHeader(cookie) } }
  );
}

