import { jsonError, jsonOk } from "@/lib/http";
import { cached } from "@/lib/introspectionCache";
import { introspect } from "@/lib/tokens";

export async function GET(req: Request) {
  const authz = req.headers.get("authorization");
  const token = authz?.startsWith("Bearer ") ? authz.slice("Bearer ".length) : null;
  if (!token) return jsonError(401, "missing_token");

  const decision = cached(`introspect:${token}`, 3000, () => introspect(token));
  if (!(decision as any).active) return jsonError(401, "invalid_token", decision as any);

  return jsonOk({
    ok: true,
    data: { message: "secret resource", userId: (decision as any).userId }
  });
}

