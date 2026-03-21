import { streams } from "@/lib/orderedStream";
import { jsonError, jsonOk } from "@/lib/http";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const streamId = url.searchParams.get("streamId") || "";
  if (!streamId) return jsonError(400, "missing_streamId");
  return jsonOk({ ok: true, state: streams.snapshot(streamId) });
}

