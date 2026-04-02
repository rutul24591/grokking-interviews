import { store } from "@/lib/retentionStore";
import { jsonError, jsonOk } from "@/lib/http";
import { z } from "zod";

const QuerySchema = z.object({
  store: z.enum(["active", "archive"]),
  userId: z.string().optional()
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = QuerySchema.safeParse({
    store: url.searchParams.get("store") ?? "active",
    userId: url.searchParams.get("userId") ?? undefined
  });
  if (!parsed.success) return jsonError(400, "invalid_query", { issues: parsed.error.issues });
  return jsonOk({ ok: true, events: store.query(parsed.data.store, parsed.data.userId) });
}

