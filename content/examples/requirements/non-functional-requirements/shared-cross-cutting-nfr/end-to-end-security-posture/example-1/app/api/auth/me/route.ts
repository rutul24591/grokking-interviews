import { jsonError, jsonOk } from "@/lib/http";
import { verifySessionFromRequest } from "@/lib/session";

export async function GET(req: Request) {
  const s = verifySessionFromRequest(req);
  if (!s.ok) return jsonOk({ user: null });
  return jsonOk({ user: { id: s.userId, email: "staff@example.com" }, csrfToken: s.csrfToken });
}

