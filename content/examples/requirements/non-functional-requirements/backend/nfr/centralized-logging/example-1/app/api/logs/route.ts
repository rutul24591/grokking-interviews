import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/http";
import { query, resetLogs } from "@/lib/logger";

const QuerySchema = z.object({ requestId: z.string().optional() });

export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = QuerySchema.safeParse(Object.fromEntries(url.searchParams.entries()));
  if (!parsed.success) return jsonError(400, "invalid_query", { issues: parsed.error.issues });
  return jsonOk({ ok: true, logs: query(parsed.data.requestId ?? null) });
}

export async function DELETE() {
  resetLogs();
  return jsonOk({ ok: true });
}

