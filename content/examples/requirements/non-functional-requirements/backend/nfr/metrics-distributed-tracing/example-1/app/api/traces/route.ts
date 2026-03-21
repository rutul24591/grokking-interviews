import { jsonError, jsonOk } from "@/lib/http";
import { traceStore } from "@/lib/tracing";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const traceId = (url.searchParams.get("traceId") || "").trim().toLowerCase();
  if (!traceId) return jsonError(400, "missing_traceId");
  return jsonOk({ ok: true, traceId, spans: traceStore.get(traceId) });
}

