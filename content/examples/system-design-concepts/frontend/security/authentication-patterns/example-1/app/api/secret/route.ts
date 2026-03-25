import { getAuth } from "../../../lib/requestAuth";

export async function GET() {
  const auth = await getAuth();
  if (!auth.authenticated) return Response.json({ error: "unauthenticated" }, { status: 401 });

  const isAdmin = auth.session.roles.includes("admin");
  return Response.json({
    ok: true,
    secret: isAdmin ? "admin-secret: 42" : "reader-secret: 7",
    note: "Authn identifies the user; authz decides what they can access (RBAC article)."
  });
}

