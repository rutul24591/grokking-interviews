import { verifyAccess } from "../../../lib/serverTokens";

export async function GET(req: Request) {
  const auth = req.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice("Bearer ".length) : "";
  if (!token) return Response.json({ error: "missing_access" }, { status: 401 });

  const v = verifyAccess(token);
  if (!v.ok) return Response.json({ error: v.error }, { status: 401 });

  return Response.json({ ok: true, userId: v.userId, expMs: v.expMs, data: "protected payload" });
}

