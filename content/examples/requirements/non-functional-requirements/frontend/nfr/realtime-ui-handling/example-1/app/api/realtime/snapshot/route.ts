import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/http";
import { snapshot } from "@/lib/realtime";

const QuerySchema = z.object({ cursor: z.coerce.number().int().min(0).default(0) });

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = QuerySchema.safeParse(Object.fromEntries(url.searchParams.entries()));
  if (!q.success) return jsonError(400, "invalid_query", { issues: q.error.issues });
  return jsonOk({ ok: true, ...snapshot(q.data.cursor) });
}

