import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/http";
import { search } from "@/lib/search";

const QuerySchema = z.object({
  q: z.string().default(""),
  delayMs: z.coerce.number().int().min(0).max(3000).default(500)
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = QuerySchema.safeParse(Object.fromEntries(url.searchParams.entries()));
  if (!parsed.success) return jsonError(400, "invalid_query", { issues: parsed.error.issues });
  const results = await search(parsed.data.q, parsed.data.delayMs);
  return jsonOk({ ok: true, results });
}

