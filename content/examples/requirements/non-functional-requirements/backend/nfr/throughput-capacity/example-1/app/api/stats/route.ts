import { batcher } from "@/lib/batcher";
import { jsonOk } from "@/lib/http";

export async function GET() {
  return jsonOk({ ok: true, stats: batcher.stats() });
}

