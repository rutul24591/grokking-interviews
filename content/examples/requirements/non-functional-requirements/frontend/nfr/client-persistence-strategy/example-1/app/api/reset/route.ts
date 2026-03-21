import { jsonOk } from "@/lib/http";
import { reset } from "@/lib/store";

export async function POST() {
  reset();
  return jsonOk({ ok: true });
}

