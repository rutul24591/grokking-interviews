import { log } from "@/lib/eventLog";
import { jsonError, jsonOk } from "@/lib/http";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const consumerId = url.searchParams.get("consumerId") || "";
  if (!consumerId) return jsonError(400, "missing_consumerId");
  return jsonOk({ ok: true, checkpoint: log.checkpoint(consumerId) });
}

