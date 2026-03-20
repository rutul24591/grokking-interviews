import { jsonOk } from "@/lib/http";
import { resetRumStore } from "@/lib/rum/store";

export async function POST() {
  resetRumStore();
  return jsonOk({ ok: true });
}

