import { jsonError, jsonOk } from "@/lib/http";
import { verifySessionFromRequest } from "@/lib/session";
import { deleteNote } from "@/lib/store";

function enforceCsrf(req: Request, csrfToken: string): string | null {
  const origin = req.headers.get("origin");
  const allowed = new Set((process.env.APP_ORIGINS || "http://localhost:3000").split(",").map((s) => s.trim()));
  if (origin && !allowed.has(origin)) return "bad_origin";
  const secFetch = req.headers.get("sec-fetch-site");
  if (secFetch === "cross-site") return "cross_site";
  const provided = req.headers.get("x-csrf-token");
  if (!provided || provided !== csrfToken) return "bad_csrf";
  return null;
}

export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const s = verifySessionFromRequest(req);
  if (!s.ok) return jsonError(401, "unauthorized", { reason: s.reason });
  const csrfErr = enforceCsrf(req, s.csrfToken);
  if (csrfErr) return jsonError(403, "csrf", { reason: csrfErr });
  const ok = deleteNote(s.userId, id);
  if (!ok) return jsonError(404, "not_found");
  return jsonOk({ ok: true });
}

