import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/http";
import { getUser, visibleDocs } from "@/lib/authz";

const QuerySchema = z.object({ userId: z.string().min(1) });

export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = QuerySchema.safeParse(Object.fromEntries(url.searchParams.entries()));
  if (!parsed.success) return jsonError(400, "invalid_query", { issues: parsed.error.issues });
  const user = getUser(parsed.data.userId);
  if (!user) return jsonError(404, "user_not_found");
  return jsonOk({ ok: true, user, docs: visibleDocs(user) });
}

