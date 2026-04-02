import { log } from "@/lib/eventLog";
import { jsonError, jsonOk } from "@/lib/http";
import { z } from "zod";

const QuerySchema = z.object({
  from: z.coerce.number().int().nonnegative(),
  limit: z.coerce.number().int().positive().max(500)
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = QuerySchema.safeParse({
    from: url.searchParams.get("from") ?? "0",
    limit: url.searchParams.get("limit") ?? "50"
  });
  if (!parsed.success) return jsonError(400, "invalid_query", { issues: parsed.error.issues });
  return jsonOk({ ok: true, events: log.read(parsed.data.from, parsed.data.limit) });
}

