import { batcher } from "@/lib/batcher";
import { jsonOk } from "@/lib/http";

export async function POST() {
  batcher.reset();
  return jsonOk({ ok: true });
}

