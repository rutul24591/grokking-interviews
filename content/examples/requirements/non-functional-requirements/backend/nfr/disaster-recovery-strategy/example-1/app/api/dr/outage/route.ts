import { dr } from "@/lib/drStore";
import { jsonOk } from "@/lib/http";

export async function POST() {
  dr.outage();
  return jsonOk({ ok: true, primaryUp: dr.primaryUp });
}

