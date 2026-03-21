import { dr } from "@/lib/drStore";
import { jsonOk } from "@/lib/http";

export async function GET() {
  return jsonOk({ ok: true, status: dr.status() });
}

