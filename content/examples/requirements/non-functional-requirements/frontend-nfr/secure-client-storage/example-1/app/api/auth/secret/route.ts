import { jsonError, jsonOk } from "@/lib/http";
import { validateBearer, validateSession } from "@/lib/auth";

export async function GET(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const sid = cookie
    .split(";")
    .map((p) => p.trim())
    .find((p) => p.startsWith("sid="))
    ?.split("=")[1] || null;

  const authz = req.headers.get("authorization");
  const bearer = authz?.startsWith("Bearer ") ? authz.slice("Bearer ".length) : null;

  const session = validateSession(sid);
  const token = validateBearer(bearer);

  const identity = session || token;
  if (!identity) return jsonError(401, "unauthorized");

  return jsonOk({
    ok: true,
    userId: identity.userId,
    secret: "top_secret_value",
    note: session ? "httpOnly cookie session" : "bearer token (JS-readable)"
  });
}

