import { jsonOk } from "@/lib/http";
import { getConfig } from "@/lib/store";

export async function GET() {
  return jsonOk({ ok: true, config: getConfig() });
}

