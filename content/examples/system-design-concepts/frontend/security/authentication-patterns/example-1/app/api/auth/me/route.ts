import { getAuth } from "../../../../lib/requestAuth";

export async function GET() {
  const auth = await getAuth();
  if (!auth.authenticated) return Response.json({ authenticated: false });
  const { session } = auth;
  return Response.json({
    authenticated: true,
    user: { userId: session.userId, username: session.username, roles: session.roles, createdAt: session.createdAt }
  });
}

