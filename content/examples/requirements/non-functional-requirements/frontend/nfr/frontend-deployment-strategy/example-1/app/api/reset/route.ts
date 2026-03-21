import { jsonOk } from "@/lib/http";
import { getConfig, reset } from "@/lib/store";

export async function POST() {
  reset();
  return jsonOk({ ok: true, config: getConfig() });
}

