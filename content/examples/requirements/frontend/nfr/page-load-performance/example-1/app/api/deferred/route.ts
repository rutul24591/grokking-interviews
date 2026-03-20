import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/http";
import { slowData } from "@/lib/data";

const QuerySchema = z.object({
  delayMs: z.coerce.number().int().min(0).max(8000).default(1200)
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = QuerySchema.safeParse(Object.fromEntries(url.searchParams.entries()));
  if (!q.success) return jsonError(400, "invalid_query", { issues: q.error.issues });
  return jsonOk(await slowData(q.data.delayMs));
}

