import { z } from "zod";
import { authenticate } from "../../../../lib/users";
import { createSession } from "../../../../lib/sessionStore";
import { buildSessionSetCookie, packSessionCookie } from "../../../../lib/sessionCookie";

const bodySchema = z.object({
  username: z.string().min(1).max(64),
  password: z.string().min(1).max(128)
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) return Response.json({ error: "invalid input" }, { status: 400 });

  const user = authenticate(parsed.data.username, parsed.data.password);
  if (!user) return Response.json({ error: "invalid credentials" }, { status: 401 });

  const session = createSession(user);
  const cookieValue = packSessionCookie(session.sessionId);

  return Response.json(
    { ok: true, user: { userId: user.userId, username: user.username, roles: user.roles } },
    { headers: { "Set-Cookie": buildSessionSetCookie(cookieValue) } }
  );
}

