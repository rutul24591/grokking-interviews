import { jsonOk } from "@/lib/http";
import { resetRealtime } from "@/lib/realtime";

export async function POST() {
  resetRealtime();
  return jsonOk({ ok: true });
}

