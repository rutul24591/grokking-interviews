import { log } from "@/lib/durableLog";
import { jsonOk } from "@/lib/http";

export async function POST() {
  log.crash();
  return jsonOk({ ok: true });
}

