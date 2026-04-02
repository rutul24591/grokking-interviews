import { jsonOk } from "@/lib/http";
import { reset, getConfig } from "@/lib/store";

export async function POST() {
  reset();
  return jsonOk({ ok: true, config: getConfig() });
}

