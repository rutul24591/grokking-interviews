import { getAuth } from "../../../../lib/requestAuth";
import { hasPermission } from "../../../../lib/rbac";

export async function POST() {
  const auth = await getAuth();
  if (!auth.authenticated) return Response.json({ error: "unauthenticated" }, { status: 401 });
  if (!hasPermission(auth.session.role as any, "article:publish")) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }
  return Response.json({ ok: true, publishedAt: Date.now(), by: auth.session.username });
}

