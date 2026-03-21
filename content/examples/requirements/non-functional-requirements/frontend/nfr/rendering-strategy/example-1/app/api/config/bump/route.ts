import { jsonOk } from "@/lib/http";
import { bumpConfig } from "@/lib/config";

export async function POST() {
  bumpConfig();
  return jsonOk({ ok: true });
}

