import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/http";
import { evaluate, getDoc, getUser } from "@/lib/authz";

const QuerySchema = z.object({
  userId: z.string().min(1),
  docId: z.string().min(1),
  action: z.enum(["read", "edit", "delete"])
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = QuerySchema.safeParse(Object.fromEntries(url.searchParams.entries()));
  if (!parsed.success) return jsonError(400, "invalid_query", { issues: parsed.error.issues });

  const user = getUser(parsed.data.userId);
  const doc = getDoc(parsed.data.docId);
  if (!user || !doc) return jsonError(404, "not_found");

  const decision = evaluate(user, doc, parsed.data.action);
  return jsonOk({ ok: true, user, doc, action: parsed.data.action, ...decision });
}

