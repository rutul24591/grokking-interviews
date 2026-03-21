import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/http";
import { filterArticles } from "@/lib/articles";

const QuerySchema = z.object({ tag: z.string().optional() });

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = QuerySchema.safeParse(Object.fromEntries(url.searchParams.entries()));
  if (!q.success) return jsonError(400, "invalid_query", { issues: q.error.issues });
  const tag = q.data.tag?.trim() || null;
  return jsonOk({ ok: true, items: filterArticles(tag), tag });
}

