import { log } from "@/lib/durableLog";
import { jsonOk } from "@/lib/http";

export async function POST() {
  return jsonOk({ ok: true, ...log.replay() });
}

