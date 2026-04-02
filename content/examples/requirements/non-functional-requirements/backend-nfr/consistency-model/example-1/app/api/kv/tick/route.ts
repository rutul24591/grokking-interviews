import { kv } from "@/lib/replicatedKv";
import { jsonOk } from "@/lib/http";

export async function POST() {
  return jsonOk({ ok: true, ...kv.tick() });
}

