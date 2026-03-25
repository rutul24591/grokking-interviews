import { getAuth } from "../../../../lib/requestAuth";
import { hasPermission } from "../../../../lib/rbac";

export async function GET() {
  const auth = await getAuth();
  if (!auth.authenticated) return Response.json({ error: "unauthenticated" }, { status: 401 });
  if (!hasPermission(auth.session.role as any, "admin:users:read")) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }
  return Response.json({
    ok: true,
    users: [
      { userId: "u1", username: "alice", role: "admin" },
      { userId: "u2", username: "bob", role: "editor" },
      { userId: "u3", username: "carol", role: "reader" }
    ]
  });
}

